-- =====================================================================
--  Huellita Perdida · Esquema de base de datos (Supabase / PostgreSQL)
--  Ejecutar completo en: Supabase → SQL Editor → New query → Run.
--  Es idempotente: se puede volver a ejecutar sin perder datos.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
--  1. Perfiles (uno por usuario registrado)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  tipo           text not null default 'particular' check (tipo in ('particular', 'negocio')),
  nombre_negocio text not null default '',
  email          text not null default '',
  created_at     timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "perfil: leer propio" on public.profiles;
create policy "perfil: leer propio" on public.profiles
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "perfil: crear propio" on public.profiles;
create policy "perfil: crear propio" on public.profiles
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "perfil: editar propio" on public.profiles;
create policy "perfil: editar propio" on public.profiles
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Crea el perfil automáticamente al registrarse.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
--  2. Suscripciones (las escribe solo el servidor con la service role)
-- ---------------------------------------------------------------------
create table if not exists public.subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users(id) on delete set null,
  stripe_session_id  text unique,
  stripe_customer_id text,
  plan_id            text not null check (plan_id in ('pro', 'premium')),
  business_name      text not null,
  email              text,
  status             text not null default 'pending',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Si la tabla ya existía de la versión anterior, agrega la columna nueva.
alter table public.subscriptions
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.subscriptions enable row level security;

drop policy if exists "suscripcion: leer propia" on public.subscriptions;
create policy "suscripcion: leer propia" on public.subscriptions
  for select to authenticated using (user_id = auth.uid());

-- No hay políticas de insert/update: solo el backend (service role) escribe pagos.

create or replace function public.has_paid_plan()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.subscriptions s
    where s.user_id = auth.uid() and s.status = 'active'
  );
$$;

-- ---------------------------------------------------------------------
--  3. Reportes (perdidos, encontrados y adopciones)
-- ---------------------------------------------------------------------
create table if not exists public.reports (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete set null default auth.uid(),
  tipo                text not null check (tipo in ('perdido', 'encontrado', 'adopcion')),
  nombre              text not null default '',
  foto_url            text,
  color               text not null,
  tamano              text not null,
  ciudad              text not null,
  fecha               date not null default current_date,
  descripcion         text not null check (char_length(descripcion) between 1 and 500),
  edad                text not null default 'Joven',
  vacunado            boolean not null default false,
  esterilizado        boolean not null default false,
  destacado           boolean not null default false,
  estado              text not null default 'activo' check (estado in ('activo', 'resuelto')),
  publicado_por       text,
  vistas              integer not null default 0,
  contactos_recibidos integer not null default 0,
  created_at          timestamptz not null default now()
);

create index if not exists reports_created_idx on public.reports (created_at desc);
create index if not exists reports_user_idx on public.reports (user_id);

alter table public.reports enable row level security;

-- Privilegios por columna: nadie puede escribir contadores ni el dueño.
revoke all on public.reports from anon, authenticated;
grant select on public.reports to anon, authenticated;
grant insert (tipo, nombre, foto_url, color, tamano, ciudad, fecha, descripcion,
              edad, vacunado, esterilizado, destacado, publicado_por)
  on public.reports to authenticated;
grant update (estado) on public.reports to authenticated;
grant delete on public.reports to authenticated;

drop policy if exists "reportes: lectura pública" on public.reports;
create policy "reportes: lectura pública" on public.reports
  for select to anon, authenticated using (true);

drop policy if exists "reportes: publicar" on public.reports;
create policy "reportes: publicar" on public.reports
  for insert to authenticated
  with check (user_id = auth.uid() and (not destacado or public.has_paid_plan()));

drop policy if exists "reportes: actualizar propios" on public.reports;
create policy "reportes: actualizar propios" on public.reports
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "reportes: eliminar propios" on public.reports;
create policy "reportes: eliminar propios" on public.reports
  for delete to authenticated using (user_id = auth.uid());

-- Límite del plan gratis: 3 adopciones activas.
create or replace function public.enforce_adoption_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.tipo = 'adopcion'
     and new.user_id is not null
     and not exists (select 1 from public.subscriptions s
                     where s.user_id = new.user_id and s.status = 'active')
     and (select count(*) from public.reports r
          where r.user_id = new.user_id and r.tipo = 'adopcion' and r.estado = 'activo') >= 3
  then
    raise exception 'LIMITE_ADOPCIONES: el plan gratis permite hasta 3 adopciones activas'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists reports_adoption_limit on public.reports;
create trigger reports_adoption_limit
  before insert on public.reports
  for each row execute function public.enforce_adoption_limit();

-- ---------------------------------------------------------------------
--  4. Contactos (privados: solo se revelan por decisión de quien consulta)
-- ---------------------------------------------------------------------
create table if not exists public.report_contacts (
  report_id uuid primary key references public.reports(id) on delete cascade,
  nombre    text not null,
  telefono  text not null
);

alter table public.report_contacts enable row level security;
revoke all on public.report_contacts from anon, authenticated;
grant select, insert on public.report_contacts to authenticated;

drop policy if exists "contacto: publicar propio" on public.report_contacts;
create policy "contacto: publicar propio" on public.report_contacts
  for insert to authenticated
  with check (exists (select 1 from public.reports r
                      where r.id = report_id and r.user_id = auth.uid()));

drop policy if exists "contacto: leer propio" on public.report_contacts;
create policy "contacto: leer propio" on public.report_contacts
  for select to authenticated
  using (exists (select 1 from public.reports r
                 where r.id = report_id and r.user_id = auth.uid()));

-- Revela el contacto de UN reporte y suma al contador de contactos.
create or replace function public.reveal_contact(rid uuid)
returns table (contacto_nombre text, contacto_telefono text)
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.reports set contactos_recibidos = contactos_recibidos + 1
  where reports.id = rid;
  return query
    select c.nombre, c.telefono from public.report_contacts c where c.report_id = rid;
end;
$$;

create or replace function public.bump_view(rid uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.reports set vistas = vistas + 1 where id = rid;
$$;

revoke execute on function public.reveal_contact(uuid) from public;
revoke execute on function public.bump_view(uuid) from public;
grant execute on function public.reveal_contact(uuid) to anon, authenticated;
grant execute on function public.bump_view(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
--  5. Fotos (Storage)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

drop policy if exists "fotos: subir en carpeta propia" on storage.objects;
create policy "fotos: subir en carpeta propia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------
--  7. Comentarios y denuncias (cualquier persona puede enviar; nadie los lee desde la web)
-- ---------------------------------------------------------------------
create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  tipo       text not null check (tipo in ('problema', 'idea', 'publicacion')),
  mensaje    text not null check (char_length(mensaje) between 5 and 1000),
  contacto   text not null default '' check (char_length(contacto) <= 120),
  report_id  uuid references public.reports(id) on delete set null,
  pagina     text not null default '' check (char_length(pagina) <= 200),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;
revoke all on public.feedback from anon, authenticated;
grant insert (tipo, mensaje, contacto, report_id, pagina) on public.feedback to anon, authenticated;

drop policy if exists "feedback: enviar" on public.feedback;
create policy "feedback: enviar" on public.feedback
  for insert to anon, authenticated with check (true);

-- ---------------------------------------------------------------------
--  6. Datos de ejemplo (opcional; se pueden borrar desde el panel)
-- ---------------------------------------------------------------------
insert into public.reports (id, tipo, nombre, color, tamano, ciudad, fecha, descripcion,
                            edad, vacunado, esterilizado, destacado, estado, publicado_por,
                            vistas, contactos_recibidos)
values
  ('00000000-0000-4000-8000-000000000001', 'perdido', 'Toby', 'Café', 'Mediano', 'Guadalajara', '2026-08-26',
   'Salió cuando el portón quedó abierto. Es amigable y lleva un collar rojo sin placa.',
   'Adulto', false, false, false, 'activo', null, 34, 2),
  ('00000000-0000-4000-8000-000000000002', 'encontrado', '', 'Blanco', 'Chico', 'Ciudad de México', '2026-08-28',
   'Perrita blanca, tranquila y sin collar. Está resguardada mientras aparece su familia.',
   'Joven', false, false, false, 'activo', null, 18, 1),
  ('00000000-0000-4000-8000-000000000003', 'perdido', 'Luna', 'Negro', 'Grande', 'Monterrey', '2026-08-20',
   'Se perdió cerca del parque y ya volvió a casa gracias al reporte de una vecina.',
   'Adulto', false, false, false, 'resuelto', null, 61, 6),
  ('00000000-0000-4000-8000-000000000004', 'adopcion', 'Canela', 'Dorado', 'Mediano', 'Querétaro', '2026-08-24',
   'Rescatada hace tres meses. Es juguetona, sociable y está lista para un hogar responsable.',
   'Joven', true, true, true, 'activo', 'Refugio Patitas Felices', 128, 14),
  ('00000000-0000-4000-8000-000000000005', 'adopcion', 'Rocky', 'Negro', 'Grande', 'Puebla', '2026-08-18',
   'Perro tranquilo, ideal para una casa con patio. Convive bien con otros perros.',
   'Adulto', true, false, false, 'activo', 'Casa Animal Puebla', 72, 5)
on conflict (id) do nothing;

insert into public.report_contacts (report_id, nombre, telefono)
values
  ('00000000-0000-4000-8000-000000000001', 'Marisol', '33 1234 5678'),
  ('00000000-0000-4000-8000-000000000002', 'Diego', '55 9876 5432'),
  ('00000000-0000-4000-8000-000000000003', 'Ana', '81 5555 2211'),
  ('00000000-0000-4000-8000-000000000004', 'Refugio Patitas Felices', '44 2700 1122'),
  ('00000000-0000-4000-8000-000000000005', 'Casa Animal Puebla', '22 2301 4480')
on conflict (report_id) do nothing;
