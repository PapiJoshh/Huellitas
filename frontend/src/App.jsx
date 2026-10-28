import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Eye,
  HeartHandshake,
  ImagePlus,
  MapPin,
  Megaphone,
  MessageCircle,
  PawPrint,
  Phone,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Syringe,
  Trash2,
  X,
} from "lucide-react";
import {
  createCheckoutSession,
  registerSuccessfulPayment,
} from "./lib/payments";
import {
  HelpView,
  HowItWorks,
  PlanCompare,
  SiteFooter,
} from "./sections.jsx";
import heroImage from "./assets/huellita-hero.webp";

const CIUDADES = [
  "Ciudad de México",
  "Guadalajara",
  "Monterrey",
  "Puebla",
  "Querétaro",
  "Mérida",
  "Tijuana",
];
const TAMANOS = ["Chico", "Mediano", "Grande"];
const COLORES = ["Café", "Negro", "Blanco", "Dorado", "Manchado", "Gris"];
const EDADES = ["Cachorro", "Joven", "Adulto", "Senior"];
const STORAGE_REPORTS = "huellita-perdida-reportes-v2";
const STORAGE_ACCOUNT = "huellita-perdida-cuenta-v2";

const PLAN_INFO = {
  gratis: {
    nombre: "Plan gratis",
    precio: "$0",
    limite: 3,
    verificado: false,
    destacado: false,
  },
  pro: {
    nombre: "Refugio Pro",
    precio: "$249",
    limite: Infinity,
    verificado: true,
    destacado: true,
  },
  premium: {
    nombre: "Negocio Premium",
    precio: "$499",
    limite: Infinity,
    verificado: true,
    destacado: true,
  },
};

const SEED_REPORTS = [
  {
    id: "toby-gdl",
    tipo: "perdido",
    nombre: "Toby",
    foto: null,
    color: "Café",
    tamano: "Mediano",
    ciudad: "Guadalajara",
    fecha: "2026-08-26",
    descripcion:
      "Salió cuando el portón quedó abierto. Es amigable y lleva un collar rojo sin placa.",
    contactoNombre: "Marisol",
    contactoTelefono: "33 1234 5678",
    estado: "activo",
    publicadoPor: null,
    edad: "Adulto",
    vacunado: false,
    esterilizado: false,
    destacado: false,
    vistas: 34,
    contactosRecibidos: 2,
  },
  {
    id: "nube-cdmx",
    tipo: "encontrado",
    nombre: "",
    foto: null,
    color: "Blanco",
    tamano: "Chico",
    ciudad: "Ciudad de México",
    fecha: "2026-08-28",
    descripcion:
      "Perrita blanca, tranquila y sin collar. Está resguardada mientras aparece su familia.",
    contactoNombre: "Diego",
    contactoTelefono: "55 9876 5432",
    estado: "activo",
    publicadoPor: null,
    edad: "Joven",
    vacunado: false,
    esterilizado: false,
    destacado: false,
    vistas: 18,
    contactosRecibidos: 1,
  },
  {
    id: "luna-mty",
    tipo: "perdido",
    nombre: "Luna",
    foto: null,
    color: "Negro",
    tamano: "Grande",
    ciudad: "Monterrey",
    fecha: "2026-08-20",
    descripcion:
      "Se perdió cerca del parque y ya volvió a casa gracias al reporte de una vecina.",
    contactoNombre: "Ana",
    contactoTelefono: "81 5555 2211",
    estado: "resuelto",
    publicadoPor: null,
    edad: "Adulto",
    vacunado: false,
    esterilizado: false,
    destacado: false,
    vistas: 61,
    contactosRecibidos: 6,
  },
  {
    id: "canela-qro",
    tipo: "adopcion",
    nombre: "Canela",
    foto: null,
    color: "Dorado",
    tamano: "Mediano",
    ciudad: "Querétaro",
    fecha: "2026-08-24",
    descripcion:
      "Rescatada hace tres meses. Es juguetona, sociable y está lista para un hogar responsable.",
    contactoNombre: "Refugio Patitas Felices",
    contactoTelefono: "44 2700 1122",
    estado: "activo",
    publicadoPor: "Refugio Patitas Felices",
    edad: "Joven",
    vacunado: true,
    esterilizado: true,
    destacado: true,
    vistas: 128,
    contactosRecibidos: 14,
  },
  {
    id: "rocky-pue",
    tipo: "adopcion",
    nombre: "Rocky",
    foto: null,
    color: "Negro",
    tamano: "Grande",
    ciudad: "Puebla",
    fecha: "2026-08-18",
    descripcion:
      "Perro tranquilo, ideal para una casa con patio. Convive bien con otros perros.",
    contactoNombre: "Casa Animal Puebla",
    contactoTelefono: "22 2301 4480",
    estado: "activo",
    publicadoPor: "Casa Animal Puebla",
    edad: "Adulto",
    vacunado: true,
    esterilizado: false,
    destacado: false,
    vistas: 72,
    contactosRecibidos: 5,
  },
];

const PLAN_FEATURES = {
  gratis: [
    "Hasta 3 adopciones activas",
    "Reportes comunitarios ilimitados",
    "Ficha con datos de contacto",
  ],
  pro: [
    "Adopciones ilimitadas",
    "Insignia de refugio verificado",
    "Publicaciones destacadas",
    "Estadísticas de interés",
  ],
  premium: [
    "Todo lo incluido en Pro",
    "Perfil para tu negocio",
    "Destacados ilimitados",
    "Soporte prioritario",
  ],
};

function emptyForm() {
  return {
    tipo: "perdido",
    nombre: "",
    foto: null,
    color: COLORES[0],
    tamano: TAMANOS[1],
    ciudad: CIUDADES[1],
    fecha: new Date().toISOString().slice(0, 10),
    descripcion: "",
    contactoNombre: "",
    contactoTelefono: "",
    edad: EDADES[1],
    vacunado: false,
    esterilizado: false,
    destacado: false,
  };
}

function loadReports() {
  try {
    const saved = window.localStorage.getItem(STORAGE_REPORTS);
    return saved ? JSON.parse(saved) : SEED_REPORTS;
  } catch {
    return SEED_REPORTS;
  }
}

function loadAccount() {
  const fallback = {
    tipo: "particular",
    nombreNegocio: "",
    email: "",
    plan: "gratis",
  };
  try {
    const saved = window.localStorage.getItem(STORAGE_ACCOUNT);
    const account = saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
    const params = new URLSearchParams(window.location.search);
    const paidPlan = params.get("plan");
    if (params.get("payment") === "success" && PLAN_INFO[paidPlan]) {
      return { ...account, tipo: "negocio", plan: paidPlan };
    }
    return account;
  } catch {
    return fallback;
  }
}

function loadPaymentMessage() {
  const payment = new URLSearchParams(window.location.search).get("payment");
  if (payment === "success") {
    return { text: "Pago confirmado. Tu plan ya está activo.", tone: "success" };
  }
  if (payment === "cancelled") {
    return {
      text: "El pago fue cancelado. Puedes intentarlo cuando quieras.",
      tone: "info",
    };
  }
  return null;
}

function reportLabel(report) {
  if (report.estado === "resuelto") {
    return report.tipo === "adopcion" ? "Adoptado" : "Reunidos";
  }
  if (report.tipo === "perdido") return "Perdido";
  if (report.tipo === "encontrado") return "Encontrado";
  return "En adopción";
}

function ReportBadge({ report }) {
  const style = report.estado === "resuelto" ? "resuelto" : report.tipo;
  return (
    <span className={`report-badge badge-${style}`}>
      {reportLabel(report)}
    </span>
  );
}

function AppButton({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function ReportCard({ report, onOpen }) {
  return (
    <button
      type="button"
      className={`report-note ${report.destacado ? "is-featured" : ""}`}
      onClick={onOpen}
      aria-label={`Abrir reporte de ${report.nombre || "mascota sin nombre"}`}
    >
      <div className="report-image">
        {report.destacado && (
          <span className="featured-ribbon">
            <Star /> Destacado
          </span>
        )}
        {report.foto ? (
          <img
            src={report.foto}
            alt={`Foto de ${report.nombre || "la mascota reportada"}`}
          />
        ) : (
          <div className="pet-placeholder" aria-hidden="true">
            <PawPrint />
            <span>Foto pendiente</span>
          </div>
        )}
      </div>
      <div className="note-body">
        <div className="note-meta">
          <ReportBadge report={report} />
          <span>
            {new Date(`${report.fecha}T12:00:00`).toLocaleDateString(
              "es-MX",
              { day: "2-digit", month: "short" },
            )}
          </span>
        </div>
        <h3>{report.nombre || "Sin nombre"}</h3>
        <p className="note-description">{report.descripcion}</p>
        <div className="note-location">
          <MapPin />
          <span>{report.ciudad}</span>
        </div>
        <div className="note-footer">
          <span>
            {report.color} · {report.tamano}
          </span>
          <span className="views">
            <Eye /> {report.vistas}
          </span>
        </div>
      </div>
    </button>
  );
}

function EmptyState({ adoption, onPublish }) {
  return (
    <div className="empty-state">
      <PawPrint />
      <h3>No encontramos reportes con esos filtros</h3>
      <p>
        {adoption
          ? "Prueba otra ciudad o publica una mascota en adopción."
          : "Prueba otra búsqueda o crea un reporte para ayudar a la comunidad."}
      </p>
      <AppButton onClick={onPublish}>
        <Plus /> Crear publicación
      </AppButton>
    </div>
  );
}

function Header({ view, onChange }) {
  const navigation = [
    ["tablero", "Tablón"],
    ["adopciones", "Adopciones"],
    ["publicar", "Publicar"],
    ["planes", "Planes"],
    ["ayuda", "Ayuda"],
    ["cuenta", "Mi cuenta"],
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => onChange("tablero")}>
          <span className="brand-mark">
            <PawPrint />
          </span>
          <span>
            Huellita <small>Perdida</small>
          </span>
        </button>
        <nav className="main-nav" aria-label="Navegación principal">
          {navigation.map(([id, label]) => (
            <button
              key={id}
              className={view === id ? "is-active" : ""}
              aria-current={view === id ? "page" : undefined}
              onClick={() => onChange(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <span className="header-status">
          <span /> Red comunitaria activa
        </span>
      </div>
    </header>
  );
}

function ReunitedSection({ reports, adoption, onOpen }) {
  const done = reports
    .filter(
      (report) =>
        report.estado === "resuelto" &&
        (adoption ? report.tipo === "adopcion" : report.tipo !== "adopcion"),
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 3);

  if (!done.length) return null;
  return (
    <section className="band band-alt" aria-labelledby="reunited-title">
      <div className="page-wrap">
        <div className="section-heading">
          <div>
            <h2 id="reunited-title">
              {adoption ? "Ya encontraron familia" : "Ya volvieron a casa"}
            </h2>
            <p className="section-sub">
              Reportes que la comunidad ayudó a cerrar con buenas noticias.
            </p>
          </div>
        </div>
        <div className="report-grid">
          {done.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onOpen={() => onOpen(report.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReportsView({
  reports,
  allReports,
  adoption,
  search,
  setSearch,
  city,
  setCity,
  type,
  setType,
  onlyActive,
  setOnlyActive,
  onOpen,
  onPublish,
  onHelp,
}) {
  const typeOptions = [
    ["todos", "Todos"],
    ["perdido", "Perdidos"],
    ["encontrado", "Encontrados"],
  ];
  const pool = allReports.filter((report) =>
    adoption ? report.tipo === "adopcion" : report.tipo !== "adopcion",
  );

  return (
    <main>
      <section className="hero">
        <div className="page-wrap hero-grid">
          <div className="hero-copy">
            <h1>
              {adoption
                ? "Un hogar puede empezar aquí."
                : "Cada reporte acerca una huella a casa."}
            </h1>
            <p>
              {adoption
                ? "Conoce perros rescatados por refugios y personas comprometidas con la adopción responsable."
                : "Publica, busca y comparte reportes de mascotas perdidas o encontradas en tu ciudad, en todo México."}
            </p>
            <div className="hero-actions">
              <AppButton onClick={onPublish}>
                <Megaphone /> Crear reporte
              </AppButton>
              <button type="button" className="text-link" onClick={onHelp}>
                Cómo funciona <ArrowRight />
              </button>
            </div>
            <p className="hero-note">
              <ShieldCheck /> Tu contacto se muestra solo si decides compartirlo
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <img src={heroImage} alt="" />
          </div>
        </div>
      </section>

      <section className="board-section" aria-labelledby="board-title">
        <div className="page-wrap">
          <div className="section-heading">
            <h2 id="board-title">
              {adoption ? "Buscan una familia" : "Reportes de la comunidad"}
            </h2>
            <div className="summary-pills">
              <span>
                <strong>
                  {pool.filter((report) => report.estado === "activo").length}
                </strong>{" "}
                activos
              </span>
              <span>
                <strong>
                  {pool.filter((report) => report.estado === "resuelto").length}
                </strong>{" "}
                historias felices
              </span>
            </div>
          </div>

          <div className="filter-bar">
            <div className="search-box">
              <Search />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre, color o descripción"
                aria-label="Buscar reportes"
              />
            </div>
            {!adoption && (
              <div className="segmented" role="group" aria-label="Tipo de reporte">
                {typeOptions.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={type === value}
                    onClick={() => setType(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            <select
              className="filter-select"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              aria-label="Filtrar por ciudad"
            >
              <option value="todas">Todas las ciudades</option>
              {CIUDADES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <label className="active-switch">
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={(event) => setOnlyActive(event.target.checked)}
              />
              <span className="switch-control" />
              Solo activos
            </label>
          </div>

          {reports.length ? (
            <div className="report-grid">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onOpen={() => onOpen(report.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState adoption={adoption} onPublish={onPublish} />
          )}
        </div>
      </section>

      <ReunitedSection
        reports={allReports}
        adoption={adoption}
        onOpen={onOpen}
      />
      <HowItWorks onPublish={onPublish} />
    </main>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="field-stack">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PublishView({ form, setForm, account, onSubmit, notify }) {
  const fileInput = useRef(null);
  const plan = PLAN_INFO[account.plan];

  function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Selecciona un archivo de imagen válido.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify("La foto debe pesar menos de 5 MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((current) => ({ ...current, foto: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  return (
    <main className="page-wrap narrow-page">
      <div className="page-intro">
        <h1>Publica un reporte claro y fácil de compartir.</h1>
        <p>
          Los campos marcados con * nos ayudan a mostrar la información más
          importante primero.
        </p>
      </div>

      <form className="publish-card" onSubmit={onSubmit}>
        <div className="form-section-heading">
          <span>1</span>
          <div>
            <h2>¿Qué quieres reportar?</h2>
            <p>Elige la categoría que mejor describe el caso.</p>
          </div>
        </div>
        <div className="type-options">
          {[
            ["perdido", "Perdí a mi mascota", Search],
            ["encontrado", "Encontré una mascota", MapPin],
            ["adopcion", "Busco una familia", HeartHandshake],
          ].map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              className={form.tipo === value ? "is-selected" : ""}
              onClick={() =>
                setForm((current) => ({ ...current, tipo: value }))
              }
            >
              <Icon />
              <span>{label}</span>
              {form.tipo === value && <Check />}
            </button>
          ))}
        </div>

        <div className="form-divider" />
        <div className="form-section-heading">
          <span>2</span>
          <div>
            <h2>Datos de la mascota</h2>
            <p>Añade señales que ayuden a reconocerla.</p>
          </div>
        </div>
        <div className="photo-and-fields">
          <div className="photo-column">
            <button
              type="button"
              className="photo-picker"
              onClick={() => fileInput.current?.click()}
            >
              {form.foto ? (
                <img src={form.foto} alt="Vista previa de la mascota" />
              ) : (
                <>
                  <ImagePlus />
                  <strong>Subir foto</strong>
                  <small>JPG o PNG, máximo 5 MB</small>
                </>
              )}
            </button>
            <ul className="photo-tips">
              <li>Usa luz natural y una foto reciente.</li>
              <li>Muestra el rostro y el cuerpo completo.</li>
              <li>Incluye el collar o las marcas que la distinguen.</li>
            </ul>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <div className="form-grid">
            <label className="field-stack span-two">
              <span>
                Nombre {form.tipo === "encontrado" ? "(si lo conoces)" : "*"}
              </span>
              <input
                value={form.nombre}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nombre: event.target.value,
                  }))
                }
                placeholder="Ej. Toby"
              />
            </label>
            <SelectField
              label="Color *"
              value={form.color}
              options={COLORES}
              onChange={(value) =>
                setForm((current) => ({ ...current, color: value }))
              }
            />
            <SelectField
              label="Tamaño *"
              value={form.tamano}
              options={TAMANOS}
              onChange={(value) =>
                setForm((current) => ({ ...current, tamano: value }))
              }
            />
            {form.tipo === "adopcion" && (
              <SelectField
                label="Edad aproximada"
                value={form.edad}
                options={EDADES}
                onChange={(value) =>
                  setForm((current) => ({ ...current, edad: value }))
                }
              />
            )}
            <SelectField
              label="Ciudad *"
              value={form.ciudad}
              options={CIUDADES}
              onChange={(value) =>
                setForm((current) => ({ ...current, ciudad: value }))
              }
            />
            <label className="field-stack">
              <span>Fecha *</span>
              <input
                type="date"
                value={form.fecha}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fecha: event.target.value,
                  }))
                }
              />
            </label>
          </div>
        </div>

        {form.tipo === "adopcion" && (
          <div className="check-row">
            <label>
              <input
                type="checkbox"
                checked={form.vacunado}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    vacunado: event.target.checked,
                  }))
                }
              />
              <Syringe /> Vacunado
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.esterilizado}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    esterilizado: event.target.checked,
                  }))
                }
              />
              <CheckCircle2 /> Esterilizado
            </label>
            {plan.destacado && (
              <label>
                <input
                  type="checkbox"
                  checked={form.destacado}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      destacado: event.target.checked,
                    }))
                  }
                />
                <Star /> Destacar publicación
              </label>
            )}
          </div>
        )}

        <label className="field-stack description-field">
          <span>Descripción *</span>
          <textarea
            rows={4}
            maxLength={500}
            value={form.descripcion}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                descripcion: event.target.value,
              }))
            }
            placeholder="Describe dónde fue vista, señas particulares y su comportamiento…"
          />
          <small>{form.descripcion.length}/500 caracteres</small>
        </label>

        <div className="form-divider" />
        <div className="form-section-heading">
          <span>3</span>
          <div>
            <h2>Datos de contacto</h2>
            <p>Solo serán visibles cuando alguien abra tu publicación.</p>
          </div>
        </div>
        <div className="form-grid contact-fields">
          <label className="field-stack">
            <span>Tu nombre *</span>
            <input
              value={form.contactoNombre}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contactoNombre: event.target.value,
                }))
              }
              placeholder="Nombre o refugio"
            />
          </label>
          <label className="field-stack">
            <span>Teléfono *</span>
            <input
              inputMode="tel"
              value={form.contactoTelefono}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contactoTelefono: event.target.value,
                }))
              }
              placeholder="33 0000 0000"
            />
          </label>
        </div>
        <div className="privacy-note">
          <ShieldCheck />
          <span>
            <strong>Tu privacidad importa.</strong> No mostramos el teléfono
            directamente en las tarjetas públicas.
          </span>
        </div>
        <AppButton type="submit" className="submit-report">
          <Megaphone /> Publicar en el tablón <ArrowRight />
        </AppButton>
      </form>
    </main>
  );
}

function PlansView({
  account,
  setAccount,
  onChoose,
  loading,
}) {
  return (
    <main className="page-wrap">
      <div className="page-intro centered-intro">
        <h1>Más alcance para quienes ayudan todos los días.</h1>
        <p>
          Reportar mascotas perdidas o encontradas siempre es gratis. Los
          planes apoyan la gestión de adopciones.
        </p>
      </div>

      <section className="payment-identity">
        <div>
          <Building2 />
          <span>
            <strong>Datos para activar un plan</strong>
            <small>Usaremos estos datos en el proceso de pago.</small>
          </span>
        </div>
        <div className="payment-fields">
          <input
            value={account.nombreNegocio}
            onChange={(event) =>
              setAccount((current) => ({
                ...current,
                tipo: "negocio",
                nombreNegocio: event.target.value,
              }))
            }
            placeholder="Nombre del refugio o negocio"
          />
          <input
            type="email"
            value={account.email}
            onChange={(event) =>
              setAccount((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            placeholder="correo@negocio.com"
          />
        </div>
      </section>

      <div className="plans-grid">
        {Object.keys(PLAN_INFO).map((id) => {
          const info = PLAN_INFO[id];
          const current = account.plan === id;
          return (
            <article
              key={id}
              className={`plan-card ${id === "pro" ? "popular" : ""}`}
            >
              {id === "pro" && (
                <span className="popular-label">
                  <Star /> Más elegido
                </span>
              )}
              <div className="plan-icon">
                {id === "gratis" ? (
                  <PawPrint />
                ) : id === "pro" ? (
                  <BadgeCheck />
                ) : (
                  <Sparkles />
                )}
              </div>
              <h2>{info.nombre}</h2>
              <p className="plan-price">
                {info.precio}
                <span> MXN / mes</span>
              </p>
              <p className="plan-for">
                {id === "gratis"
                  ? "Para comenzar"
                  : id === "pro"
                    ? "Para refugios activos"
                    : "Para veterinarias y negocios"}
              </p>
              <ul>
                {PLAN_FEATURES[id].map((feature) => (
                  <li key={feature}>
                    <CheckCircle2 /> {feature}
                  </li>
                ))}
              </ul>
              <AppButton
                variant={current ? "secondary" : id === "pro" ? "primary" : "outline"}
                disabled={current || loading !== null}
                onClick={() => onChoose(id)}
              >
                {current ? (
                  <>
                    <Check /> Plan actual
                  </>
                ) : loading === id ? (
                  "Abriendo pago…"
                ) : id === "gratis" ? (
                  "Elegir gratis"
                ) : (
                  "Elegir plan"
                )}
              </AppButton>
            </article>
          );
        })}
      </div>
      <p className="payment-footnote">
        <ShieldCheck /> El pago se procesa de forma segura. Huellita Perdida no
        almacena los datos de tu tarjeta.
      </p>
      <PlanCompare plans={Object.values(PLAN_INFO).map((plan) => plan.nombre)} />
    </main>
  );
}

function AccountView({
  account,
  setAccount,
  reports,
  onPublish,
  onPlans,
  onOpen,
}) {
  const plan = PLAN_INFO[account.plan];
  const mine = reports.filter(
    (report) =>
      report.tipo === "adopcion" &&
      report.publicadoPor === account.nombreNegocio &&
      Boolean(account.nombreNegocio),
  );

  return (
    <main className="page-wrap">
      <section className="account-hero">
        <div className="business-avatar">
          <Building2 />
        </div>
        <div className="account-title">
          <h1>{account.nombreNegocio || "Tu refugio o negocio"}</h1>
          <p>
            Administra tus publicaciones de adopción y revisa el interés que
            generan.
          </p>
        </div>
        <span className={`plan-status ${plan.verificado ? "verified" : ""}`}>
          {plan.verificado && <BadgeCheck />} {plan.nombre}
        </span>
      </section>

      <section className="account-settings">
        <div>
          <h2>Configura tu perfil</h2>
          <p>Estos datos se usan al crear publicaciones de adopción.</p>
        </div>
        <div className="account-fields">
          <label>
            <span>Tipo de cuenta</span>
            <select
              value={account.tipo}
              onChange={(event) =>
                setAccount((current) => ({
                  ...current,
                  tipo: event.target.value,
                }))
              }
            >
              <option value="particular">Persona particular</option>
              <option value="negocio">Refugio o negocio</option>
            </select>
          </label>
          <label>
            <span>Nombre del refugio o negocio</span>
            <input
              value={account.nombreNegocio}
              onChange={(event) =>
                setAccount((current) => ({
                  ...current,
                  nombreNegocio: event.target.value,
                }))
              }
              placeholder="Ej. Patitas Felices"
            />
          </label>
          <label>
            <span>Correo de contacto</span>
            <input
              type="email"
              value={account.email}
              onChange={(event) =>
                setAccount((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="hola@refugio.com"
            />
          </label>
        </div>
      </section>

      <div className="stats-grid">
        <article>
          <span>
            <Megaphone />
          </span>
          <div>
            <small>Publicaciones</small>
            <strong>{mine.length}</strong>
          </div>
        </article>
        <article>
          <span>
            <Eye />
          </span>
          <div>
            <small>Vistas totales</small>
            <strong>
              {mine.reduce((sum, report) => sum + report.vistas, 0)}
            </strong>
          </div>
        </article>
        <article>
          <span>
            <MessageCircle />
          </span>
          <div>
            <small>Contactos</small>
            <strong>
              {mine.reduce((sum, report) => sum + report.contactosRecibidos, 0)}
            </strong>
          </div>
        </article>
      </div>

      <section className="account-publications">
        <div className="section-heading">
          <div>
            <h2>Publicaciones de adopción</h2>
          </div>
          <div className="heading-actions">
            <AppButton variant="outline" onClick={onPlans}>
              Ver planes
            </AppButton>
            <AppButton onClick={onPublish}>
              <Plus /> Publicar
            </AppButton>
          </div>
        </div>
        {mine.length ? (
          <div className="report-grid account-report-grid">
            {mine.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onOpen={() => onOpen(report.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState adoption onPublish={onPublish} />
        )}
      </section>
    </main>
  );
}

function DetailModal({
  report,
  onClose,
  onResolve,
  onDelete,
  onReveal,
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  if (!report) return null;

  function shareReport() {
    const title = `${reportLabel(report)}: ${report.nombre || "mascota sin nombre"} en ${report.ciudad}`;
    const url = window.location.origin + window.location.pathname;
    if (navigator.share) {
      navigator.share({ title, text: title, url }).catch(() => {});
      return;
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="report-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X />
        </button>
        <div className="dialog-photo">
          {report.foto ? (
            <img
              src={report.foto}
              alt={`Foto de ${report.nombre || "la mascota"}`}
            />
          ) : (
            <div className="pet-placeholder">
              <PawPrint />
              <span>Sin fotografía</span>
            </div>
          )}
          <ReportBadge report={report} />
        </div>
        <div className="dialog-body">
          <div className="dialog-title-row">
            <div>
              <span>
                {report.tipo === "adopcion"
                  ? report.publicadoPor
                  : "Reporte comunitario"}
              </span>
              <h2 id="detail-title">{report.nombre || "Sin nombre"}</h2>
            </div>
            <span className="view-count">
              <Eye /> {report.vistas} vistas
            </span>
          </div>
          <p className="dialog-description">{report.descripcion}</p>
          <div className="detail-grid">
            <div>
              <MapPin />
              <span>
                <small>Ciudad</small>
                <strong>{report.ciudad}</strong>
              </span>
            </div>
            <div>
              <CalendarDays />
              <span>
                <small>Fecha</small>
                <strong>
                  {new Date(`${report.fecha}T12:00:00`).toLocaleDateString(
                    "es-MX",
                    { day: "numeric", month: "long", year: "numeric" },
                  )}
                </strong>
              </span>
            </div>
            <div>
              <PawPrint />
              <span>
                <small>Características</small>
                <strong>
                  {report.color} · {report.tamano}
                </strong>
              </span>
            </div>
            {report.tipo === "adopcion" && (
              <div>
                <Syringe />
                <span>
                  <small>Salud</small>
                  <strong>
                    {report.vacunado ? "Vacunado" : "Sin dato"} ·{" "}
                    {report.esterilizado
                      ? "Esterilizado"
                      : "No esterilizado"}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {revealed ? (
            <a
              className="contact-revealed"
              href={`tel:${report.contactoTelefono.replace(/\D/g, "")}`}
            >
              <Phone />
              <span>
                <small>Contacto: {report.contactoNombre}</small>
                <strong>{report.contactoTelefono}</strong>
              </span>
              <ArrowRight />
            </a>
          ) : (
            <AppButton
              variant="outline"
              className="reveal-contact"
              onClick={() => {
                setRevealed(true);
                onReveal(report.id);
              }}
            >
              <MessageCircle /> Ver datos de contacto
            </AppButton>
          )}

          <div className="dialog-actions">
            <AppButton variant="outline" onClick={shareReport}>
              <Share2 /> Compartir
            </AppButton>
            {report.estado === "activo" && (
              <AppButton onClick={() => onResolve(report.id)}>
                <CheckCircle2 />{" "}
                {report.tipo === "adopcion"
                  ? "Marcar como adoptado"
                  : "Marcar como reunidos"}
              </AppButton>
            )}
            <AppButton
              variant="ghost"
              className="delete-button"
              onClick={() => {
                if (window.confirm("¿Eliminar esta publicación?")) {
                  onDelete(report.id);
                }
              }}
            >
              <Trash2 /> Eliminar
            </AppButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [view, setView] = useState("tablero");
  const [reports, setReports] = useState(loadReports);
  const [account, setAccount] = useState(loadAccount);
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("todas");
  const [type, setType] = useState("todos");
  const [onlyActive, setOnlyActive] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [message, setMessage] = useState(loadPaymentMessage);
  const messageTimer = useRef(null);
  const paymentHandled = useRef(false);

  function notify(text, tone = "success") {
    setMessage({ text, tone });
    window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(() => setMessage(null), 3500);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_ACCOUNT, JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    if (paymentHandled.current) return;
    paymentHandled.current = true;
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const plan = params.get("plan");
    if (payment === "success" && PLAN_INFO[plan]) {
      registerSuccessfulPayment({
        planId: plan,
        businessName: account.nombreNegocio || "Negocio",
        email: account.email || "",
      }).catch(() => {});
      window.history.replaceState({}, "", window.location.pathname);
    } else if (payment === "cancelled") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [account.email, account.nombreNegocio]);

  const visibleReports = useMemo(() => {
    const adoption = view === "adopciones";
    return reports
      .filter((report) =>
        adoption ? report.tipo === "adopcion" : report.tipo !== "adopcion",
      )
      .filter(
        (report) => adoption || type === "todos" || report.tipo === type,
      )
      .filter((report) => city === "todas" || report.ciudad === city)
      .filter((report) => !onlyActive || report.estado === "activo")
      .filter((report) => {
        const needle = search.trim().toLocaleLowerCase("es-MX");
        if (!needle) return true;
        return [
          report.nombre,
          report.color,
          report.ciudad,
          report.descripcion,
        ]
          .join(" ")
          .toLocaleLowerCase("es-MX")
          .includes(needle);
      })
      .sort(
        (a, b) =>
          Number(b.destacado) - Number(a.destacado) ||
          b.fecha.localeCompare(a.fecha),
      );
  }, [reports, view, type, city, onlyActive, search]);

  const selected =
    reports.find((report) => report.id === selectedId) || null;

  function openReport(id) {
    setSelectedId(id);
    setReports((current) =>
      current.map((report) =>
        report.id === id ? { ...report, vistas: report.vistas + 1 } : report,
      ),
    );
  }

  function submitReport(event) {
    event.preventDefault();
    if (form.tipo !== "encontrado" && !form.nombre.trim()) {
      notify("Escribe el nombre de la mascota.", "error");
      return;
    }
    if (
      !form.descripcion.trim() ||
      !form.contactoNombre.trim() ||
      !form.contactoTelefono.trim()
    ) {
      notify("Completa la descripción y los datos de contacto.", "error");
      return;
    }
    if (form.tipo === "adopcion" && account.tipo === "negocio") {
      const activeMine = reports.filter(
        (report) =>
          report.tipo === "adopcion" &&
          report.publicadoPor === account.nombreNegocio &&
          report.estado === "activo",
      ).length;
      if (activeMine >= PLAN_INFO[account.plan].limite) {
        setView("planes");
        notify("Tu plan gratis permite hasta tres adopciones activas.", "info");
        return;
      }
    }

    const report = {
      ...form,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      estado: "activo",
      publicadoPor:
        form.tipo === "adopcion" && account.nombreNegocio
          ? account.nombreNegocio
          : null,
      destacado: form.destacado && PLAN_INFO[account.plan].destacado,
      vistas: 0,
      contactosRecibidos: 0,
    };
    setReports((current) => [report, ...current]);
    setForm(emptyForm());
    setView(form.tipo === "adopcion" ? "adopciones" : "tablero");
    notify("Tu publicación ya está visible en el tablón.");
  }

  async function choosePlan(plan) {
    if (plan === "gratis") {
      setAccount((current) => ({ ...current, plan }));
      notify("Cambiaste al plan gratis.");
      return;
    }
    if (!account.nombreNegocio.trim() || !account.email.trim()) {
      notify(
        "Escribe el nombre y correo de tu negocio antes de continuar.",
        "error",
      );
      return;
    }
    setLoadingPlan(plan);
    try {
      const result = await createCheckoutSession({
        planId: plan,
        businessName: account.nombreNegocio,
        email: account.email,
      });
      if (result.demoMode) {
        setAccount((current) => ({
          ...current,
          tipo: "negocio",
          plan,
        }));
        notify("Plan activado en modo de demostración.");
      } else if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
      }
    } catch (error) {
      notify(error.message || "No se pudo iniciar el pago.", "error");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="app-shell">
      <Header view={view} onChange={setView} />
      {(view === "tablero" || view === "adopciones") && (
        <ReportsView
          reports={visibleReports}
          allReports={reports}
          adoption={view === "adopciones"}
          search={search}
          setSearch={setSearch}
          city={city}
          setCity={setCity}
          type={type}
          setType={setType}
          onlyActive={onlyActive}
          setOnlyActive={setOnlyActive}
          onOpen={openReport}
          onPublish={() => {
            if (view === "adopciones") {
              setForm((current) => ({ ...current, tipo: "adopcion" }));
            }
            setView("publicar");
          }}
          onHelp={() => setView("ayuda")}
        />
      )}
      {view === "publicar" && (
        <PublishView
          form={form}
          setForm={setForm}
          account={account}
          onSubmit={submitReport}
          notify={notify}
        />
      )}
      {view === "planes" && (
        <PlansView
          account={account}
          setAccount={setAccount}
          onChoose={choosePlan}
          loading={loadingPlan}
        />
      )}
      {view === "ayuda" && (
        <HelpView
          cities={CIUDADES}
          onPublish={() => setView("publicar")}
          onPlans={() => setView("planes")}
        />
      )}
      {view === "cuenta" && (
        <AccountView
          account={account}
          setAccount={setAccount}
          reports={reports}
          onPublish={() => {
            setForm((current) => ({ ...current, tipo: "adopcion" }));
            setView("publicar");
          }}
          onPlans={() => setView("planes")}
          onOpen={openReport}
        />
      )}

      <SiteFooter onChange={setView} />

      <DetailModal
        key={selected?.id || "closed"}
        report={selected}
        onClose={() => setSelectedId(null)}
        onResolve={(id) => {
          setReports((current) =>
            current.map((report) =>
              report.id === id ? { ...report, estado: "resuelto" } : report,
            ),
          );
          setSelectedId(null);
          notify("¡Qué buena noticia! Actualizamos la publicación.");
        }}
        onDelete={(id) => {
          setReports((current) =>
            current.filter((report) => report.id !== id),
          );
          setSelectedId(null);
          notify("La publicación fue eliminada.");
        }}
        onReveal={(id) =>
          setReports((current) =>
            current.map((report) =>
              report.id === id
                ? {
                    ...report,
                    contactosRecibidos: report.contactosRecibidos + 1,
                  }
                : report,
            ),
          )
        }
      />

      {message && (
        <div className={`toast-message toast-${message.tone}`} role="status">
          {message.tone === "error" ? <X /> : <CheckCircle2 />}
          {message.text}
        </div>
      )}
    </div>
  );
}

export default App;
