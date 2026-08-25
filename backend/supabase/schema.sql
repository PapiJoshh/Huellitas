create extension if not exists pgcrypto;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  stripe_customer_id text,
  plan_id text not null check (plan_id in ('pro', 'premium')),
  business_name text not null,
  email text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

-- El backend usa SUPABASE_SERVICE_ROLE_KEY y escribe de forma segura.
-- No crees una policy pública que permita insertar pagos desde el navegador.