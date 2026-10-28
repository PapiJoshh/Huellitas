import {
  ArrowRight,
  Check,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  PawPrint,
  Search,
  ShieldCheck,
} from "lucide-react";

const ISSUES_URL = "https://github.com/PapiJoshh/Huellitas/issues";

const STEPS = [
  {
    title: "Publica",
    text: "Sube una foto y describe a la mascota: color, tamaño y dónde la viste por última vez.",
  },
  {
    title: "Comparte",
    text: "Tu reporte aparece en el tablón de tu ciudad y lo puedes mandar por WhatsApp en un toque.",
  },
  {
    title: "Reencuéntrala",
    text: "Quien la reconozca verá tus datos de contacto solo si decide abrirlos. Cuando vuelva a casa, marca el reporte como resuelto.",
  },
];

const GUIDES = [
  {
    tone: "lost",
    icon: Search,
    title: "Perdí a mi mascota",
    tips: [
      "Publica el reporte lo antes posible, con una foto reciente.",
      "Recorre la zona a pie y a distintas horas, sobre todo al amanecer y al anochecer.",
      "Avisa a vecinos, veterinarias y tiendas cercanas.",
      "Deja a la vista algo con tu olor, como su cama o una prenda tuya.",
      "Revisa cada día los reportes de mascotas encontradas.",
    ],
  },
  {
    tone: "found",
    icon: MapPin,
    title: "Encontré una mascota",
    tips: [
      "Revisa si trae placa o collar con un teléfono.",
      "Pide a una veterinaria que verifique si tiene microchip.",
      "Mantenla en un lugar seguro, con agua y sin otras mascotas.",
      "Publica su foto y guarda un detalle que solo su dueño sabría.",
      "Antes de entregarla, pide que describan sus señas particulares.",
    ],
  },
  {
    tone: "adopt",
    icon: HeartHandshake,
    title: "Quiero adoptar",
    tips: [
      "Pregunta si está vacunado y esterilizado.",
      "Conócelo en persona antes de decidir.",
      "Piensa en tu tiempo, tu espacio y los gastos del día a día.",
      "Prefiere refugios con insignia de verificado.",
      "No envíes dinero por adelantado a personas que no conoces.",
    ],
  },
];

const SAFETY = [
  "Reúnete en un lugar público y, de preferencia, acompañado.",
  "Nunca envíes dinero por adelantado ni compartas datos bancarios.",
  "Pide fotos o videos recientes antes de dar más información.",
  "Si algo te parece sospechoso, termina la conversación.",
];

export function HowItWorks({ onPublish }) {
  return (
    <section className="band band-alt" aria-labelledby="how-title">
      <div className="page-wrap">
        <div className="section-heading">
          <div>
            <h2 id="how-title">Así funciona</h2>
            <p className="section-sub">
              Tres pasos para que una mascota vuelva a casa.
            </p>
          </div>
        </div>
        <ol className="steps">
          {STEPS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="steps-cta">
          <button type="button" className="btn btn-primary" onClick={onPublish}>
            Crear un reporte
          </button>
        </div>
      </div>
    </section>
  );
}

export function PlanCompare({ plans }) {
  const rows = [
    ["Adopciones activas", ["3", "Ilimitadas", "Ilimitadas"]],
    ["Reportes de perdidos y encontrados", [true, true, true]],
    ["Insignia de refugio verificado", [false, true, true]],
    ["Publicaciones destacadas", [false, true, true]],
    ["Estadísticas de interés", [false, true, true]],
    ["Perfil para tu negocio", [false, false, true]],
    ["Soporte prioritario", [false, false, true]],
  ];

  return (
    <section className="compare" aria-labelledby="compare-title">
      <h2 id="compare-title">Compara los planes</h2>
      <div className="compare-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Característica</span>
              </th>
              {plans.map((plan) => (
                <th key={plan} scope="col">
                  {plan}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, values]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {values.map((value, index) => (
                  <td key={`${label}-${plans[index]}`}>
                    {value === true ? (
                      <Check aria-label="Incluido" />
                    ) : value === false ? (
                      <span className="no" aria-label="No incluido">
                        —
                      </span>
                    ) : (
                      value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function HelpView({ cities, onPublish, onPlans }) {
  const faq = [
    [
      "¿Publicar una mascota perdida o encontrada cuesta algo?",
      "No. Reportar mascotas perdidas o encontradas siempre es gratis. Los planes de pago son para refugios y negocios que gestionan adopciones.",
    ],
    [
      "¿Quién puede ver mi teléfono?",
      "El teléfono no aparece en las tarjetas del tablón. Solo se muestra cuando alguien abre tu publicación y elige ver los datos de contacto.",
    ],
    [
      "¿Cómo aviso que mi mascota ya volvió?",
      "Abre tu reporte y toca «Marcar como reunidos». El reporte pasa a la sección «Ya volvieron a casa».",
    ],
    [
      "¿Cuántas adopciones puedo publicar gratis?",
      "Hasta tres adopciones activas con el plan gratis. Refugio Pro y Negocio Premium no tienen límite.",
    ],
    [
      "¿Cómo se paga un plan?",
      "El pago se procesa de forma segura con Stripe. Huellita Perdida no almacena los datos de tu tarjeta.",
    ],
    [
      "¿En qué ciudades puedo publicar?",
      `Por ahora en ${cities.slice(0, -1).join(", ")} y ${cities[cities.length - 1]}.`,
    ],
  ];

  return (
    <main>
      <section className="band" style={{ paddingBottom: "3rem" }}>
        <div className="page-wrap">
          <div className="page-intro">
            <h1>Ayuda y consejos</h1>
            <p>
              Qué hacer si perdiste, encontraste o quieres adoptar una mascota.
            </p>
          </div>
          <div className="guide-grid">
            {GUIDES.map(({ tone, icon: Icon, title, tips }) => (
              <article key={title} className="guide-card">
                <span className={`guide-icon ${tone}`}>
                  <Icon />
                </span>
                <h2 style={{ fontSize: "1.5rem" }}>{title}</h2>
                <ul>
                  {tips.map((tip) => (
                    <li key={tip}>
                      <CheckCircle2 />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks onPublish={onPublish} />

      <section className="band" aria-labelledby="safety-title">
        <div className="page-wrap safety">
          <div>
            <h2 id="safety-title">Cuida tu seguridad</h2>
            <p>
              La mayoría de las personas que ayudan lo hacen de buena fe. Estas
              reglas simples te protegen del resto.
            </p>
          </div>
          <ul>
            {SAFETY.map((item) => (
              <li key={item}>
                <ShieldCheck />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band band-alt" aria-labelledby="faq-title">
        <div className="page-wrap faq">
          <h2 id="faq-title">Preguntas frecuentes</h2>
          {faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="band" aria-labelledby="contact-title">
        <div className="page-wrap contact-band">
          <PawPrint aria-hidden="true" width="40" height="40" />
          <h2 id="contact-title">¿Algo no funciona o tienes una idea?</h2>
          <p>
            Cuéntanos qué viste. Cada comentario ayuda a que más mascotas
            vuelvan a casa.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <a
              className="btn btn-primary"
              href={ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enviar un comentario
            </a>
            <button type="button" className="text-link" onClick={onPlans}>
              Ver planes para refugios <ArrowRight />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function SiteFooter({ onChange }) {
  const link = (id, label) => (
    <li>
      <button type="button" onClick={() => onChange(id)}>
        {label}
      </button>
    </li>
  );

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-brand">
              <span className="brand-mark small">
                <PawPrint />
              </span>
              Huellita Perdida
            </div>
            <p>
              Una red comunitaria para ayudar a las mascotas de México a volver
              a casa.
            </p>
          </div>
          <nav className="footer-col" aria-label="Explorar">
            <h3>Explorar</h3>
            <ul>
              {link("tablero", "Tablón")}
              {link("adopciones", "Adopciones")}
              {link("publicar", "Publicar")}
            </ul>
          </nav>
          <nav className="footer-col" aria-label="Organizaciones">
            <h3>Organizaciones</h3>
            <ul>
              {link("planes", "Planes")}
              {link("cuenta", "Mi cuenta")}
            </ul>
          </nav>
          <nav className="footer-col" aria-label="Ayuda">
            <h3>Ayuda</h3>
            <ul>
              {link("ayuda", "Consejos")}
              {link("ayuda", "Preguntas frecuentes")}
              <li>
                <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
                  Enviar un comentario
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="footer-bottom">
          © {new Date().getFullYear()} Huellita Perdida. Hecho con cuidado para
          cada huella.
        </p>
      </div>
    </footer>
  );
}
