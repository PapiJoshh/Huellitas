import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  PawPrint,
  MapPin,
  Camera,
  Phone,
  X,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  ImagePlus,
  ArrowLeft,
  Star,
  Lock,
  Eye,
  MessageCircle,
  Syringe,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { createCheckoutSession, registerSuccessfulPayment } from './lib/payments';

const C = {
  cork: "#4A3427",
  corkDark: "#3A2A1F",
  paper: "#FBF7ED",
  paperAlt: "#EFE4CC",
  ink: "#2E2418",
  muted: "#8C7A63",
  red: "#C1440E",
  redDark: "#8F3009",
  green: "#3F7D53",
  greenDark: "#2C5A3B",
  amber: "#C98A1B",
  gold: "#B8860B",
};

const FONT_DISPLAY = "'Permanent Marker', cursive";

const ZONAS = ["Centro", "La Aurora", "El Fresno", "Guadalupe", "5 de Diciembre", "La Quinta"];
const TAMANOS = ["Chico", "Mediano", "Grande"];
const COLORES_PERRO = ["Café", "Negro", "Blanco", "Dorado", "Manchado", "Gris"];
const EDADES = ["Cachorro", "Joven", "Adulto", "Senior"];

const PLAN_INFO = {
  gratis: { label: "Plan gratis", limite: 3, destacar: false, verificado: false },
  pro: { label: "Refugio Pro", limite: Infinity, destacar: true, verificado: true },
  premium: { label: "Negocio Premium", limite: Infinity, destacar: true, verificado: true },
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function hashTilt(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return (h % 7) - 3;
}

const seedReports = [
  {
    id: uid(),
    tipo: "perdido",
    nombre: "Toby",
    foto: null,
    color: "Café",
    tamano: "Mediano",
    zona: "Centro",
    fecha: "2026-08-20",
    descripcion: "Se escapó por el portón abierto. Es muy amigable y trae collar rojo.",
    contactoNombre: "Marisol",
    contactoTelefono: "341 123 4567",
    estado: "activo",
    publicadoPor: null,
    edad: "",
    vacunado: false,
    esterilizado: false,
    destacado: false,
    vistas: 4,
    contactosRecibidos: 0,
  },
  {
    id: uid(),
    tipo: "encontrado",
    nombre: "",
    foto: null,
    color: "Blanco",
    tamano: "Chico",
    zona: "La Aurora",
    fecha: "2026-08-22",
    descripcion: "Perrita blanca muy tranquila, sin collar. La tengo resguardada en casa.",
    contactoNombre: "Diego",
    contactoTelefono: "341 987 6543",
    estado: "activo",
    publicadoPor: null,
    edad: "",
    vacunado: false,
    esterilizado: false,
    destacado: false,
    vistas: 2,
    contactosRecibidos: 0,
  },
  {
    id: uid(),
    tipo: "perdido",
    nombre: "Luna",
    foto: null,
    color: "Negro",
    tamano: "Grande",
    zona: "El Fresno",
    fecha: "2026-08-15",
    descripcion: "Se perdió cerca del parque. Ya regresó a casa gracias a un vecino.",
    contactoNombre: "Ana",
    contactoTelefono: "341 555 2211",
    estado: "resuelto",
    publicadoPor: null,
    edad: "",
    vacunado: false,
    esterilizado: false,
    destacado: false,
    vistas: 11,
    contactosRecibidos: 2,
  },
  {
    id: uid(),
    tipo: "adopcion",
    nombre: "Canela",
    foto: null,
    color: "Dorado",
    tamano: "Mediano",
    zona: "Centro",
    fecha: "2026-08-18",
    descripcion: "Rescatada hace 3 meses, ya está lista para un hogar. Es juguetona y le encanta la gente.",
    contactoNombre: "Refugio Patitas Felices",
    contactoTelefono: "341 700 1122",
    estado: "activo",
    publicadoPor: "Refugio Patitas Felices",
    edad: "Joven",
    vacunado: true,
    esterilizado: true,
    destacado: true,
    vistas: 58,
    contactosRecibidos: 6,
  },
  {
    id: uid(),
    tipo: "adopcion",
    nombre: "Rocky",
    foto: null,
    color: "Negro",
    tamano: "Grande",
    zona: "Guadalupe",
    fecha: "2026-08-10",
    descripcion: "Perro tranquilo, ideal para casa con patio. Convive bien con otros perros.",
    contactoNombre: "Refugio Patitas Felices",
    contactoTelefono: "341 700 1122",
    estado: "activo",
    publicadoPor: "Refugio Patitas Felices",
    edad: "Adulto",
    vacunado: true,
    esterilizado: false,
    destacado: false,
    vistas: 19,
    contactosRecibidos: 1,
  },
];

const emptyForm = {
  tipo: "perdido",
  nombre: "",
  foto: null,
  color: COLORES_PERRO[0],
  tamano: TAMANOS[0],
  zona: ZONAS[0],
  fecha: new Date().toISOString().slice(0, 10),
  descripcion: "",
  contactoNombre: "",
  contactoTelefono: "",
  edad: EDADES[0],
  vacunado: false,
  esterilizado: false,
  destacado: false,
};

const inputStyleBase = {
  backgroundColor: C.paper,
  border: "1px solid rgba(140,122,99,0.4)",
  color: C.ink,
};

function Badge({ estado, tipo }) {
  const cfg =
    estado === "resuelto"
      ? { label: tipo === "adopcion" ? "ADOPTADO" : "REUNIDOS", bg: C.green, fg: C.paper }
      : tipo === "perdido"
      ? { label: "PERDIDO", bg: C.red, fg: C.paper }
      : tipo === "encontrado"
      ? { label: "ENCONTRADO", bg: C.amber, fg: C.ink }
      : { label: "EN ADOPCIÓN", bg: C.greenDark, fg: C.paper };
  return (
    <span
      style={{ backgroundColor: cfg.bg, color: cfg.fg, fontSize: 11, letterSpacing: "0.04em" }}
      className="font-bold px-2 py-1 rounded"
    >
      {cfg.label}
    </span>
  );
}

function ReportCard({ r, onOpen }) {
  const tilt = hashTilt(r.id);
  return (
    <button
      onClick={onOpen}
      className="relative text-left w-full"
      style={{ transform: "rotate(" + tilt + "deg)", transition: "transform .18s ease" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0deg) translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "rotate(" + tilt + "deg)";
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          backgroundColor: r.destacado ? C.gold : C.redDark,
          position: "absolute",
          top: -5,
          left: "50%",
          marginLeft: -5,
          borderRadius: "50%",
          boxShadow: "0 2px 3px rgba(0,0,0,0.35)",
          zIndex: 2,
        }}
      />
      <div
        style={{
          backgroundColor: C.paper,
          border: r.destacado ? "2px solid " + C.gold : "1px solid rgba(140,122,99,0.35)",
        }}
        className="rounded shadow-md overflow-hidden"
      >
        {r.destacado ? (
          <div
            style={{ backgroundColor: C.gold, color: C.paper, fontSize: 10, letterSpacing: "0.06em" }}
            className="text-center font-bold py-1 flex items-center justify-center gap-1"
          >
            <Star style={{ width: 10, height: 10 }} />
            PUBLICACIÓN DESTACADA
          </div>
        ) : null}
        <div className="p-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <Badge estado={r.estado} tipo={r.tipo} />
            <span style={{ color: C.muted, fontSize: 11 }}>{r.fecha}</span>
          </div>
          <div
            style={{ backgroundColor: C.paperAlt, height: 128 }}
            className="w-full rounded flex items-center justify-center mb-3 overflow-hidden"
          >
            {r.foto ? (
              <img src={r.foto} alt={r.nombre || "perrito"} className="w-full h-full object-cover" />
            ) : (
              <PawPrint style={{ color: C.muted, width: 40, height: 40 }} />
            )}
          </div>
          <h3 style={{ color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 20 }} className="mb-1">
            {r.nombre || "Sin nombre"}
          </h3>
          <p
            style={{
              color: C.ink,
              fontSize: 13,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            className="mb-3"
          >
            {r.descripcion}
          </p>
          <div className="flex items-center gap-1 mb-2" style={{ color: C.muted, fontSize: 12 }}>
            <MapPin style={{ width: 12, height: 12 }} />
            <span>
              {r.zona} · {r.color} · {r.tamano}
            </span>
          </div>
          {r.tipo === "adopcion" ? (
            <div className="flex items-center justify-between" style={{ color: C.muted, fontSize: 11 }}>
              <span className="flex items-center gap-1">
                <Building2 style={{ width: 11, height: 11 }} />
                {r.publicadoPor}
              </span>
              <span className="flex items-center gap-1">
                <Eye style={{ width: 11, height: 11 }} />
                {r.vistas}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex" style={{ borderTop: "1px dashed rgba(140,122,99,0.5)" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                borderRight: i < 2 ? "1px dashed rgba(140,122,99,0.5)" : "none",
                color: C.muted,
                fontSize: 10,
                letterSpacing: "0.05em",
              }}
              className="flex-1 text-center py-2"
            >
              {r.contactoTelefono ? r.contactoTelefono.slice(-4) : "----"}
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

function DetailModal({ r, onClose, onResolve, onDelete, onReveal }) {
  const [revealed, setRevealed] = useState(false);
  if (!r) return null;
  return (
    <div
      style={{ minHeight: 400, backgroundColor: "rgba(30,20,12,0.55)" }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
    >
      <div
        style={{ backgroundColor: C.paper, maxWidth: 420, width: "100%" }}
        className="rounded-lg shadow-md overflow-hidden relative"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{ color: C.muted }}
          className="absolute top-3 right-3 p-1 z-10"
        >
          <X style={{ width: 20, height: 20 }} />
        </button>
        <div style={{ backgroundColor: C.paperAlt, height: 180 }} className="w-full flex items-center justify-center">
          {r.foto ? (
            <img src={r.foto} alt={r.nombre || "perrito"} className="w-full h-full object-cover" />
          ) : (
            <PawPrint style={{ color: C.muted, width: 56, height: 56 }} />
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Badge estado={r.estado} tipo={r.tipo} />
            <span style={{ color: C.muted, fontSize: 12 }}>{r.fecha}</span>
          </div>
          <h2 style={{ color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 26 }} className="mb-2">
            {r.nombre || "Sin nombre"}
          </h2>
          <p style={{ color: C.ink, fontSize: 14, lineHeight: 1.5 }} className="mb-4">
            {r.descripcion}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p style={{ color: C.muted, fontSize: 11 }}>Zona</p>
              <p style={{ color: C.ink, fontSize: 13 }}>{r.zona}</p>
            </div>
            <div>
              <p style={{ color: C.muted, fontSize: 11 }}>Color</p>
              <p style={{ color: C.ink, fontSize: 13 }}>{r.color}</p>
            </div>
            <div>
              <p style={{ color: C.muted, fontSize: 11 }}>Tamaño</p>
              <p style={{ color: C.ink, fontSize: 13 }}>{r.tamano}</p>
            </div>
            {r.tipo === "adopcion" ? (
              <div>
                <p style={{ color: C.muted, fontSize: 11 }}>Edad</p>
                <p style={{ color: C.ink, fontSize: 13 }}>{r.edad || "—"}</p>
              </div>
            ) : (
              <div>
                <p style={{ color: C.muted, fontSize: 11 }}>Reportó</p>
                <p style={{ color: C.ink, fontSize: 13 }}>{r.contactoNombre}</p>
              </div>
            )}
          </div>

          {r.tipo === "adopcion" ? (
            <div className="flex items-center gap-4 mb-4" style={{ fontSize: 12, color: C.ink }}>
              <span className="flex items-center gap-1">
                <Syringe style={{ width: 14, height: 14, color: r.vacunado ? C.green : C.muted }} />
                {r.vacunado ? "Vacunado" : "Sin datos de vacunas"}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 style={{ width: 14, height: 14, color: r.esterilizado ? C.green : C.muted }} />
                {r.esterilizado ? "Esterilizado" : "No esterilizado"}
              </span>
            </div>
          ) : null}

          {r.tipo === "adopcion" ? (
            <div
              style={{ backgroundColor: C.paperAlt, fontSize: 12, color: C.muted }}
              className="rounded px-3 py-2 mb-4 flex items-center justify-between"
            >
              <span className="flex items-center gap-1">
                <Building2 style={{ width: 12, height: 12 }} />
                Publicado por {r.publicadoPor}
              </span>
              <span className="flex items-center gap-1">
                <Eye style={{ width: 12, height: 12 }} />
                {r.vistas} vistas
              </span>
            </div>
          ) : null}

          {revealed ? (
            <div
              style={{ backgroundColor: C.paperAlt }}
              className="rounded flex items-center gap-2 px-3 py-2 mb-4"
            >
              <Phone style={{ width: 16, height: 16, color: C.redDark }} />
              <span style={{ color: C.ink, fontSize: 14, fontWeight: 600 }}>{r.contactoTelefono}</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setRevealed(true);
                onReveal(r.id);
              }}
              style={{ backgroundColor: C.paperAlt, color: C.ink, border: "1px dashed rgba(140,122,99,0.6)" }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded mb-4 text-sm font-bold"
            >
              <MessageCircle style={{ width: 16, height: 16 }} />
              Ver datos de contacto
            </button>
          )}

          {r.estado === "activo" ? (
            <div className="flex gap-2">
              <button
                onClick={() => onResolve(r.id)}
                style={{ backgroundColor: C.green, color: C.paper }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold"
              >
                <CheckCircle2 style={{ width: 16, height: 16 }} />
                {r.tipo === "adopcion" ? "Marcar como adoptado" : "Marcar como reunidos"}
              </button>
              <button
                onClick={() => onDelete(r.id)}
                style={{ border: "1px solid rgba(140,122,99,0.5)", color: C.muted }}
                className="p-2 rounded"
                aria-label="Eliminar publicación"
              >
                <Trash2 style={{ width: 16, height: 16 }} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onDelete(r.id)}
              style={{ border: "1px solid rgba(140,122,99,0.5)", color: C.muted }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded"
            >
              <Trash2 style={{ width: 16, height: 16 }} />
              Quitar del tablón
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PlanCard({ id, current, onChoose, popular, title, price, features, loading }) {
  const isCurrent = current === id;
  return (
    <div
      style={{
        backgroundColor: C.paper,
        border: popular ? "2px solid " + C.gold : "1px solid rgba(140,122,99,0.35)",
      }}
      className="rounded-lg overflow-hidden flex flex-col"
    >
      {popular ? (
        <div style={{ backgroundColor: C.gold, color: C.paper, fontSize: 11 }} className="text-center font-bold py-1">
          MÁS ELEGIDO
        </div>
      ) : (
        <div style={{ height: 24 }} />
      )}
      <div className="p-5 flex-1 flex flex-col">
        <h3 style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: 22 }} className="mb-1">
          {title}
        </h3>
        <p style={{ color: C.ink, fontSize: 24, fontWeight: 700 }} className="mb-4">
          {price}
          <span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}> /mes</span>
        </p>
        <ul className="mb-5" style={{ flex: 1 }}>
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 mb-2" style={{ color: C.ink, fontSize: 13 }}>
              <CheckCircle2 style={{ width: 15, height: 15, color: C.green, marginTop: 1, flexShrink: 0 }} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => onChoose(id)}
          disabled={isCurrent || loading}
          style={{
            backgroundColor: isCurrent ? C.paperAlt : C.red,
            color: isCurrent ? C.muted : C.paper,
          }}
          className="w-full py-2 rounded font-bold text-sm"
        >
          {isCurrent ? "Tu plan actual" : loading ? "Abriendo pago..." : id === "gratis" ? "Usar plan gratis" : "Pagar con tarjeta"}
        </button>
      </div>
    </div>
  );
}

export default function HuellitaPerdidaApp() {
  const [reports, setReports] = useState(seedReports);
  const [view, setView] = useState("tablero");
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const fileRef = useRef(null);

  const [account, setAccount] = useState({ tipo: "particular", nombreNegocio: "", plan: "gratis" });

  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [zonaFiltro, setZonaFiltro] = useState("todas");
  const [soloActivos, setSoloActivos] = useState(true);
  const [paymentForm, setPaymentForm] = useState({ businessName: "", email: "" });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const selected = reports.find((r) => r.id === selectedId) || null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const plan = params.get('plan');

    if (payment === 'success' && plan) {
      setPaymentStatus('Pago confirmado correctamente. Tu suscripción ya quedó registrada.');
      registerSuccessfulPayment({
        planId: plan,
        businessName: paymentForm.businessName || account.nombreNegocio || 'Negocio',
        email: paymentForm.email || '',
      }).catch(() => {});
    }

    if (payment === 'cancelled') {
      setPaymentStatus('El pago fue cancelado. Puedes intentarlo nuevamente cuando quieras.');
    }
  }, [account.nombreNegocio, paymentForm.businessName, paymentForm.email]);

  const plan = PLAN_INFO[account.plan];

  const misPublicacionesActivas = useMemo(
    () =>
      reports.filter(
        (r) => r.tipo === "adopcion" && r.publicadoPor === account.nombreNegocio && r.estado === "activo"
      ),
    [reports, account.nombreNegocio]
  );

  const misPublicacionesTodas = useMemo(
    () => reports.filter((r) => r.tipo === "adopcion" && r.publicadoPor === account.nombreNegocio),
    [reports, account.nombreNegocio]
  );

  const baseFiltered = useMemo(() => {
    const pool = view === "adopciones" ? reports.filter((r) => r.tipo === "adopcion") : reports.filter((r) => r.tipo !== "adopcion");
    return pool
      .filter((r) => (view === "adopciones" ? true : tipoFiltro === "todos" ? true : r.tipo === tipoFiltro))
      .filter((r) => (zonaFiltro === "todas" ? true : r.zona === zonaFiltro))
      .filter((r) => (soloActivos ? r.estado === "activo" : true))
      .filter((r) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          r.nombre.toLowerCase().includes(q) ||
          r.descripcion.toLowerCase().includes(q) ||
          r.zona.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (view === "adopciones" && a.destacado !== b.destacado) return a.destacado ? -1 : 1;
        return a.fecha < b.fecha ? 1 : -1;
      });
  }, [reports, search, tipoFiltro, zonaFiltro, soloActivos, view]);

  const activos = reports.filter((r) => r.estado === "activo" && r.tipo !== "adopcion").length;
  const resueltos = reports.filter((r) => r.estado === "resuelto" && r.tipo !== "adopcion").length;
  const enAdopcion = reports.filter((r) => r.tipo === "adopcion" && r.estado === "activo").length;

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }

  function handleFoto(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, foto: reader.result }));
    reader.readAsDataURL(file);
  }

  function openReport(id) {
    setSelectedId(id);
    setReports((rs) => rs.map((r) => (r.id === id && r.tipo === "adopcion" ? { ...r, vistas: r.vistas + 1 } : r)));
  }

  function revealContact(id) {
    setReports((rs) => rs.map((r) => (r.id === id ? { ...r, contactosRecibidos: r.contactosRecibidos + 1 } : r)));
  }

  function submitForm(e) {
    e.preventDefault();
    if (!form.descripcion.trim() || !form.contactoNombre.trim() || !form.contactoTelefono.trim()) {
      setFormError("Completa la descripción y tus datos de contacto antes de fijar el reporte.");
      return;
    }
    if (form.tipo === "adopcion") {
      if (!account.nombreNegocio.trim()) {
        setFormError("Escribe el nombre de tu refugio o veterinaria en la barra de cuenta antes de publicar una adopción.");
        return;
      }
      if (misPublicacionesActivas.length >= plan.limite) {
        setFormError(
          "Tu " + PLAN_INFO[account.plan].label.toLowerCase() + " permite hasta " + plan.limite + " publicaciones activas. Sube de plan para publicar sin límite."
        );
        return;
      }
    }
    const destacado = form.tipo === "adopcion" && plan.destacar ? form.destacado : false;
    const nuevo = {
      ...form,
      id: uid(),
      estado: "activo",
      destacado,
      vistas: 0,
      contactosRecibidos: 0,
      publicadoPor: form.tipo === "adopcion" ? account.nombreNegocio : null,
    };
    setReports((rs) => [nuevo, ...rs]);
    setForm(emptyForm);
    setFormError("");
    if (fileRef.current) fileRef.current.value = "";
    setView(form.tipo === "adopcion" ? "adopciones" : "tablero");
    showToast(
      form.tipo === "adopcion"
        ? "Publicación de adopción fijada" + (destacado ? " y destacada." : ".")
        : form.tipo === "perdido"
        ? "Reporte fijado en el tablón."
        : "Gracias por avisar, reporte fijado."
    );
  }

  function marcarResuelto(id) {
    setReports((rs) => rs.map((r) => (r.id === id ? { ...r, estado: "resuelto" } : r)));
    setSelectedId(null);
    showToast("¡Buena noticia! Publicación marcada como resuelta.");
  }

  function eliminar(id) {
    setReports((rs) => rs.filter((r) => r.id !== id));
    setSelectedId(null);
    showToast("Publicación retirada del tablón.");
  }

  async function elegirPlan(id) {
    if (id === 'gratis') {
      setAccount((a) => ({ ...a, plan: id }));
      showToast('Plan actualizado a Gratis.');
      return;
    }

    if (!account.nombreNegocio.trim()) {
      setPaymentStatus('Escribe el nombre del refugio o veterinaria antes de pagar.');
      setView('negocio');
      return;
    }

    setPaymentLoading(true);
    setPaymentStatus('');

    try {
      const result = await createCheckoutSession({
        planId: id,
        businessName: account.nombreNegocio,
        email: paymentForm.email || '',
      });

      if (result.checkoutUrl && result.checkoutUrl.startsWith('http')) {
        window.location.href = result.checkoutUrl;
        return;
      }

      if (result.checkoutUrl && result.demoMode) {
        setPaymentStatus('No se abrió la tarjeta porque Render no tiene configurado STRIPE_SECRET_KEY. Agrega una clave sk_test_ en las variables del servicio y vuelve a desplegar.');
        return;
      }

      setPaymentStatus('Stripe no devolvió una dirección de pago válida. Revisa la configuración de Render.');
    } catch (error) {
      setPaymentStatus(error.message || 'No se pudo iniciar el flujo de pago.');
      showToast('No se pudo pagar');
    } finally {
      setPaymentLoading(false);
    }
  }

  const inputStyle = inputStyleBase;

  const navButton = (key, label, extraOnClick) => (
    <button
      onClick={() => {
        setView(key);
        if (extraOnClick) extraOnClick();
      }}
      style={{
        backgroundColor: view === key ? C.paper : "transparent",
        color: view === key ? C.ink : C.paper,
        border: "1px solid " + (view === key ? C.paper : "rgba(251,247,237,0.4)"),
      }}
      className="nav-btn px-3 py-2 rounded font-bold text-sm"
    >
      {label}
    </button>
  );

  return (
    <div style={{ backgroundColor: C.cork, minHeight: 600, fontFamily: "system-ui, sans-serif" }} className="w-full huellita-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        #root { min-height: 100vh; }
        .huellita-shell {
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at top left, rgba(201,138,27,0.14), transparent 28%),
            linear-gradient(180deg, #2b1a12 0%, #4a3427 100%);
        }
        .topbar-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .header-account { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .panel-filters { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .nav-buttons { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .nav-btn {
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
        }
        .nav-btn:hover { transform: translateY(-1px); }
        .report-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2rem; }
        .form-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
        .contact-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
        .stat-pill {
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }
        @media (max-width: 900px) {
          .report-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .topbar-inner { align-items: flex-start; }
        }
        @media (max-width: 720px) {
          .report-grid, .form-grid, .contact-grid { grid-template-columns: 1fr; }
          .page-shell { padding-left: 1rem !important; padding-right: 1rem !important; }
          .topbar-inner { flex-direction: column; align-items: flex-start; }
          .nav-buttons { width: 100%; overflow-x: auto; padding-bottom: 0.25rem; }
          .header-account { width: 100%; }
          .header-account > input { width: 100% !important; }
          .panel-filters { flex-direction: column; align-items: stretch; }
          .panel-filters > * { width: 100%; }
          .detail-card { max-width: 100% !important; }
        }
        @media (max-width: 480px) {
          .title-brand { font-size: 2rem !important; }
          .nav-btn { padding: 0.5rem 0.7rem !important; font-size: 0.72rem !important; }
        }
      `}</style>

      <div style={{ backgroundColor: C.corkDark }}>
        <div className="topbar-inner max-w-5xl mx-auto px-6 py-6 gap-4 page-shell">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: C.red, width: 44, height: 44 }}
              className="rounded-full flex items-center justify-center shrink-0"
            >
              <PawPrint style={{ color: C.paper, width: 24, height: 24 }} />
            </div>
            <div>
              <h1 className="title-brand" style={{ fontFamily: FONT_DISPLAY, color: C.paper, fontSize: 26, lineHeight: 1 }}>
                Huellita Perdida
              </h1>
              <p style={{ color: "rgba(251,247,237,0.65)", fontSize: 12 }} className="mt-1">
                Tablón comunitario + directorio de adopción · Ciudad Guzmán
              </p>
            </div>
          </div>
          <div className="nav-buttons">
            {navButton("tablero", "Tablón")}
            {navButton("adopciones", "Adopciones")}
            {navButton("publicar", "Publicar")}
            {navButton("planes", "Planes")}
            {account.tipo === "negocio" ? navButton("negocio", "Mi negocio") : null}
          </div>
        </div>

        <div
          style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
          className="header-account max-w-5xl mx-auto px-6 py-3 page-shell"
        >
          <span style={{ color: "rgba(251,247,237,0.6)", fontSize: 12 }}>Cuenta:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setAccount((a) => ({ ...a, tipo: "particular" }))}
              style={{
                backgroundColor: account.tipo === "particular" ? C.paper : "transparent",
                color: account.tipo === "particular" ? C.ink : C.paper,
                border: "1px solid rgba(251,247,237,0.4)",
                fontSize: 12,
              }}
              className="px-3 py-1 rounded-l font-bold"
            >
              Particular
            </button>
            <button
              onClick={() => setAccount((a) => ({ ...a, tipo: "negocio" }))}
              style={{
                backgroundColor: account.tipo === "negocio" ? C.paper : "transparent",
                color: account.tipo === "negocio" ? C.ink : C.paper,
                border: "1px solid rgba(251,247,237,0.4)",
                fontSize: 12,
              }}
              className="px-3 py-1 rounded-r font-bold"
            >
              Refugio / veterinaria
            </button>
          </div>
          {account.tipo === "negocio" ? (
            <React.Fragment>
              <input
                value={account.nombreNegocio}
                onChange={(e) => setAccount((a) => ({ ...a, nombreNegocio: e.target.value }))}
                placeholder="Nombre de tu refugio o veterinaria"
                style={{ ...inputStyle, fontSize: 12, height: 28, width: 220 }}
                className="px-2 rounded flex-1 min-w-[180px]"
              />
              <span
                style={{
                  backgroundColor: plan.verificado ? C.gold : "rgba(251,247,237,0.15)",
                  color: plan.verificado ? C.paper : "rgba(251,247,237,0.8)",
                  fontSize: 11,
                }}
                className="px-2 py-1 rounded font-bold flex items-center gap-1"
              >
                {plan.verificado ? <BadgeCheck style={{ width: 12, height: 12 }} /> : null}
                {PLAN_INFO[account.plan].label}
              </span>
            </React.Fragment>
          ) : null}
        </div>

        <div className="max-w-5xl mx-auto px-6 py-3 flex gap-2 flex-wrap">
          <span
            style={{ backgroundColor: "rgba(251,247,237,0.12)", color: C.paper, fontSize: 12 }}
            className="stat-pill px-3 py-1 rounded"
          >
            {activos} activos
          </span>
          <span
            style={{ backgroundColor: "rgba(63,125,83,0.35)", color: C.paper, fontSize: 12 }}
            className="stat-pill px-3 py-1 rounded"
          >
            {resueltos} reunidos
          </span>
          <span
            style={{ backgroundColor: "rgba(184,134,11,0.4)", color: C.paper, fontSize: 12 }}
            className="stat-pill px-3 py-1 rounded"
          >
            {enAdopcion} en adopción
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 page-shell">
        {toast ? (
          <div
            style={{ backgroundColor: C.green, color: C.paper }}
            className="mb-5 px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
          >
            <CheckCircle2 style={{ width: 16, height: 16 }} />
            {toast}
          </div>
        ) : null}

        {(view === "tablero" || view === "adopciones") && (
          <div>
            <div className="panel-filters mb-6">
              <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                <Search
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    color: C.muted,
                  }}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre, zona o descripción"
                  style={{ ...inputStyle, paddingLeft: 34 }}
                  className="w-full pr-3 py-2 rounded text-sm"
                />
              </div>
              {view === "tablero" ? (
                <select
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                  style={inputStyle}
                  className="py-2 px-3 rounded text-sm"
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="perdido">Perdidos</option>
                  <option value="encontrado">Encontrados</option>
                </select>
              ) : null}
              <select
                value={zonaFiltro}
                onChange={(e) => setZonaFiltro(e.target.value)}
                style={inputStyle}
                className="py-2 px-3 rounded text-sm"
              >
                <option value="todas">Todas las zonas</option>
                {ZONAS.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm" style={{ color: C.paper }}>
                <input type="checkbox" checked={soloActivos} onChange={(e) => setSoloActivos(e.target.checked)} />
                Solo activos
              </label>
            </div>

            {baseFiltered.length === 0 ? (
              <div
                style={{ backgroundColor: "rgba(251,247,237,0.08)", border: "1px dashed rgba(251,247,237,0.35)" }}
                className="rounded-lg p-10 text-center"
              >
                <PawPrint style={{ color: C.paper, width: 32, height: 32, margin: "0 auto" }} className="mb-3 opacity-70" />
                <p style={{ color: C.paper }} className="mb-4">
                  {view === "adopciones"
                    ? "Todavía no hay perritos en adopción por aquí."
                    : "El tablón está vacío por aquí. Sé el primero en fijar un reporte."}
                </p>
                <button
                  onClick={() => setView("publicar")}
                  style={{ backgroundColor: C.red, color: C.paper }}
                  className="px-4 py-2 rounded font-bold text-sm"
                >
                  Publicar un reporte
                </button>
              </div>
            ) : (
              <div className="report-grid">
                {baseFiltered.map((r) => (
                  <ReportCard key={r.id} r={r} onOpen={() => openReport(r.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {view === "publicar" && (
          <div style={{ backgroundColor: C.paper, maxWidth: 560 }} className="mx-auto rounded-lg shadow-md p-6">
            <button
              onClick={() => setView("tablero")}
              style={{ color: C.muted, fontSize: 13 }}
              className="flex items-center gap-1 mb-4"
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              Volver al tablón
            </button>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: 24 }} className="mb-1">
              Fijar un reporte
            </h2>
            <p style={{ color: C.muted, fontSize: 13 }} className="mb-5">
              Comparte los datos del perrito para que la comunidad pueda ayudar.
            </p>

            <form onSubmit={submitForm}>
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, tipo: "perdido" }))}
                  style={{
                    backgroundColor: form.tipo === "perdido" ? C.red : C.paperAlt,
                    color: form.tipo === "perdido" ? C.paper : C.ink,
                  }}
                  className="flex-1 py-2 rounded font-bold text-sm"
                >
                  Perdí a mi perrito
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, tipo: "encontrado" }))}
                  style={{
                    backgroundColor: form.tipo === "encontrado" ? C.amber : C.paperAlt,
                    color: C.ink,
                  }}
                  className="flex-1 py-2 rounded font-bold text-sm"
                >
                  Encontré un perrito
                </button>
                {account.tipo === "negocio" ? (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, tipo: "adopcion" }))}
                    style={{
                      backgroundColor: form.tipo === "adopcion" ? C.greenDark : C.paperAlt,
                      color: form.tipo === "adopcion" ? C.paper : C.ink,
                    }}
                    className="flex-1 py-2 rounded font-bold text-sm"
                  >
                    Perrito en adopción
                  </button>
                ) : null}
              </div>

              <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">
                Nombre del perrito (si lo conoces)
              </label>
              <input
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Firulais"
                style={inputStyle}
                className="w-full py-2 px-3 rounded text-sm mb-4"
              />

              <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">
                Foto
              </label>
              <div className="flex items-center gap-3 mb-4">
                <div
                  style={{ backgroundColor: C.paperAlt, width: 64, height: 64 }}
                  className="rounded flex items-center justify-center overflow-hidden shrink-0"
                >
                  {form.foto ? (
                    <img src={form.foto} alt="vista previa" className="w-full h-full object-cover" />
                  ) : (
                    <Camera style={{ color: C.muted, width: 22, height: 22 }} />
                  )}
                </div>
                <label
                  style={{ border: "1px solid rgba(140,122,99,0.5)", color: C.ink, fontSize: 13 }}
                  className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer"
                >
                  <ImagePlus style={{ width: 14, height: 14 }} />
                  Subir foto
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} className="hidden" />
                </label>
              </div>

              <div className="form-grid mb-4">
                <div>
                  <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">
                    Color
                  </label>
                  <select
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    style={inputStyle}
                    className="w-full py-2 px-2 rounded text-sm"
                  >
                    {COLORES_PERRO.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">
                    Tamaño
                  </label>
                  <select
                    value={form.tamano}
                    onChange={(e) => setForm((f) => ({ ...f, tamano: e.target.value }))}
                    style={inputStyle}
                    className="w-full py-2 px-2 rounded text-sm"
                  >
                    {TAMANOS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                    style={inputStyle}
                    className="w-full py-2 px-2 rounded text-sm"
                  />
                </div>
              </div>

              <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">
                Zona / última ubicación vista
              </label>
              <select
                value={form.zona}
                onChange={(e) => setForm((f) => ({ ...f, zona: e.target.value }))}
                style={inputStyle}
                className="w-full py-2 px-3 rounded text-sm mb-4"
              >
                {ZONAS.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>

              {form.tipo === "adopcion" ? (
                <div style={{ backgroundColor: C.paperAlt }} className="rounded p-3 mb-4">
                  <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">
                    Edad aproximada
                  </label>
                  <select
                    value={form.edad}
                    onChange={(e) => setForm((f) => ({ ...f, edad: e.target.value }))}
                    style={inputStyle}
                    className="w-full py-2 px-2 rounded text-sm mb-3"
                  >
                    {EDADES.map((ed) => (
                      <option key={ed} value={ed}>
                        {ed}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 text-sm" style={{ color: C.ink }}>
                      <input
                        type="checkbox"
                        checked={form.vacunado}
                        onChange={(e) => setForm((f) => ({ ...f, vacunado: e.target.checked }))}
                      />
                      Vacunado
                    </label>
                    <label className="flex items-center gap-2 text-sm" style={{ color: C.ink }}>
                      <input
                        type="checkbox"
                        checked={form.esterilizado}
                        onChange={(e) => setForm((f) => ({ ...f, esterilizado: e.target.checked }))}
                      />
                      Esterilizado
                    </label>
                  </div>
                  {plan.destacar ? (
                    <label className="flex items-center gap-2 text-sm" style={{ color: C.ink }}>
                      <input
                        type="checkbox"
                        checked={form.destacado}
                        onChange={(e) => setForm((f) => ({ ...f, destacado: e.target.checked }))}
                      />
                      <Star style={{ width: 14, height: 14, color: C.gold }} />
                      Destacar esta publicación (incluido en tu plan)
                    </label>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setView("planes")}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: C.muted }}
                    >
                      <Lock style={{ width: 13, height: 13 }} />
                      Destacar publicaciones requiere plan Refugio Pro o superior — ver planes
                    </button>
                  )}
                </div>
              ) : null}

              <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">
                Descripción
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                placeholder="Características, comportamiento, dónde se vio por última vez..."
                rows={3}
                style={inputStyle}
                className="w-full py-2 px-3 rounded text-sm mb-4"
              />

              <div className="contact-grid mb-2">
                <div>
                  <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">
                    Tu nombre
                  </label>
                  <input
                    value={form.contactoNombre}
                    onChange={(e) => setForm((f) => ({ ...f, contactoNombre: e.target.value }))}
                    placeholder="Tu nombre"
                    style={inputStyle}
                    className="w-full py-2 px-3 rounded text-sm"
                  />
                </div>
                <div>
                  <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">
                    Tu teléfono
                  </label>
                  <input
                    value={form.contactoTelefono}
                    onChange={(e) => setForm((f) => ({ ...f, contactoTelefono: e.target.value }))}
                    placeholder="341 000 0000"
                    style={inputStyle}
                    className="w-full py-2 px-3 rounded text-sm"
                  />
                </div>
              </div>

              {formError ? (
                <p style={{ color: C.redDark, fontSize: 13 }} className="mb-3">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                style={{ backgroundColor: C.red, color: C.paper }}
                className="w-full py-3 rounded font-bold text-sm mt-2"
              >
                Fijar en el tablón
              </button>
            </form>
          </div>
        )}

        {view === "planes" && (
          <div>
            <div className="text-center mb-6">
              <h2 style={{ fontFamily: FONT_DISPLAY, color: C.paper, fontSize: 28 }}>Planes para refugios y veterinarias</h2>
              <p style={{ color: "rgba(251,247,237,0.7)", fontSize: 13 }}>
                Reportar perdidos y encontrados siempre es gratis. Estos planes son para negocios que publican adopciones.
              </p>
            </div>

            <div style={{ backgroundColor: C.paper, color: C.ink }} className="rounded-lg p-4 mb-6">
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, margin: 0, marginBottom: 10 }}>Pago con tarjeta</h3>
              <div className="contact-grid" style={{ marginBottom: 16 }}>
                <div>
                  <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">Nombre del negocio</label>
                  <input
                    value={paymentForm.businessName || account.nombreNegocio}
                    onChange={(e) => {
                      setPaymentForm((f) => ({ ...f, businessName: e.target.value }));
                      setAccount((a) => ({ ...a, nombreNegocio: e.target.value }));
                    }}
                    placeholder="Refugio Patitas Felices"
                    style={inputStyle}
                    className="w-full py-2 px-3 rounded text-sm"
                  />
                </div>
                <div>
                  <label style={{ color: C.ink, fontSize: 13 }} className="block mb-1 font-bold">Correo para factura</label>
                  <input
                    value={paymentForm.email}
                    onChange={(e) => setPaymentForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="hola@refugio.com"
                    type="email"
                    style={inputStyle}
                    className="w-full py-2 px-3 rounded text-sm"
                  />
                </div>
              </div>
              <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
                Flujos reales con Stripe para pagos en tarjeta y almacenamiento en base de datos con Supabase. En demo local, el sistema crea la sesión de pago con modo seguro y registra la suscripción para prueba.
              </p>
            </div>

            <div className="report-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <PlanCard
                id="gratis"
                current={account.plan}
                onChoose={elegirPlan}
                title="Gratis"
                price="$0"
                features={[
                  "Hasta 3 publicaciones de adopción activas",
                  "Aparece en el directorio de Adopciones",
                  "Reportes de perdidos/encontrados ilimitados",
                ]}
              />
              <PlanCard
                id="pro"
                current={account.plan}
                onChoose={elegirPlan}
                popular
                title="Refugio Pro"
                price="$249"
                loading={paymentLoading}
                features={[
                  "Publicaciones de adopción ilimitadas",
                  "Insignia de refugio verificado",
                  "Puede destacar publicaciones (aparecen primero)",
                  "Estadísticas de vistas y contactos",
                ]}
              />
              <PlanCard
                id="premium"
                current={account.plan}
                onChoose={elegirPlan}
                title="Negocio Premium"
                price="$499"
                loading={paymentLoading}
                features={[
                  "Todo lo de Refugio Pro",
                  "Perfil de negocio con servicios (veterinaria, estética, guardería)",
                  "Publicaciones destacadas ilimitadas",
                  "Soporte prioritario",
                ]}
              />
            </div>

            {paymentLoading ? (
              <div style={{ color: C.paper, fontSize: 13, marginTop: 12 }}>
                Iniciando pago con tarjeta... espera un momento.
              </div>
            ) : null}
          </div>
        )}

        {view === "negocio" && account.tipo === "negocio" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 style={{ fontFamily: FONT_DISPLAY, color: C.paper, fontSize: 26 }}>
                  {account.nombreNegocio || "Tu negocio"}
                </h2>
                <span
                  style={{ backgroundColor: plan.verificado ? C.gold : "rgba(251,247,237,0.15)", color: plan.verificado ? C.paper : "rgba(251,247,237,0.8)", fontSize: 12 }}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded font-bold mt-1"
                >
                  {plan.verificado ? <BadgeCheck style={{ width: 13, height: 13 }} /> : null}
                  {PLAN_INFO[account.plan].label}
                </span>
              </div>
              <button
                onClick={() => setView("planes")}
                style={{ backgroundColor: C.red, color: C.paper }}
                className="px-4 py-2 rounded font-bold text-sm"
              >
                Actualizar plan
              </button>
            </div>

            <div className="report-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              <div style={{ backgroundColor: C.paper }} className="rounded-lg p-4 text-center">
                <p style={{ color: C.muted, fontSize: 12 }}>Publicaciones activas</p>
                <p style={{ color: C.ink, fontSize: 26, fontWeight: 700 }}>
                  {misPublicacionesActivas.length}
                  {plan.limite !== Infinity ? <span style={{ fontSize: 14, color: C.muted }}> / {plan.limite}</span> : null}
                </p>
              </div>
              <div style={{ backgroundColor: C.paper }} className="rounded-lg p-4 text-center">
                <p style={{ color: C.muted, fontSize: 12 }}>Vistas totales</p>
                <p style={{ color: C.ink, fontSize: 26, fontWeight: 700 }}>
                  {misPublicacionesTodas.reduce((s, r) => s + r.vistas, 0)}
                </p>
              </div>
              <div style={{ backgroundColor: C.paper }} className="rounded-lg p-4 text-center">
                <p style={{ color: C.muted, fontSize: 12 }}>Contactos recibidos</p>
                <p style={{ color: C.ink, fontSize: 26, fontWeight: 700 }}>
                  {misPublicacionesTodas.reduce((s, r) => s + r.contactosRecibidos, 0)}
                </p>
              </div>
            </div>

            {misPublicacionesTodas.length === 0 ? (
              <div
                style={{ backgroundColor: "rgba(251,247,237,0.08)", border: "1px dashed rgba(251,247,237,0.35)" }}
                className="rounded-lg p-10 text-center"
              >
                <p style={{ color: C.paper }} className="mb-4">
                  Todavía no has publicado ningún perrito en adopción.
                </p>
                <button
                  onClick={() => setView("publicar")}
                  style={{ backgroundColor: C.red, color: C.paper }}
                  className="px-4 py-2 rounded font-bold text-sm"
                >
                  Publicar una adopción
                </button>
              </div>
            ) : (
              <div className="report-grid">
                {misPublicacionesTodas.map((r) => (
                  <ReportCard key={r.id} r={r} onOpen={() => openReport(r.id)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <DetailModal r={selected} onClose={() => setSelectedId(null)} onResolve={marcarResuelto} onDelete={eliminar} onReveal={revealContact} />
    </div>
  );
}
