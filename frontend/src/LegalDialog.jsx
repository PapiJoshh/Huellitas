import { useEffect } from "react";
import { X } from "lucide-react";

const DOCS = {
  privacidad: {
    title: "Aviso de privacidad",
    updated: "21 de noviembre de 2026",
    sections: [
      [
        "Quién es responsable",
        "Huellita Perdida es un proyecto académico de la Universidad de Guadalajara (Equipo 2). El equipo responsable del sitio es quien administra los datos descritos en este aviso. Para cualquier solicitud de privacidad usa el formulario «Reportar un problema» de la sección Ayuda.",
      ],
      [
        "Qué datos recabamos",
        "Correo electrónico y contraseña para crear tu cuenta; el nombre de tu negocio, si lo capturas; los datos de cada publicación (descripción, ciudad, fotografía, nombre y teléfono de contacto); y los mensajes que envías por el formulario de comentarios.",
      ],
      [
        "Para qué los usamos",
        "Para crear y proteger tu cuenta, mostrar tus publicaciones, permitir que otras personas te contacten cuando tú lo decides y atender comentarios o denuncias. No vendemos ni compartimos tus datos con terceros con fines comerciales.",
      ],
      [
        "Tu teléfono y datos de contacto",
        "El teléfono no aparece en el tablón. Solo se muestra cuando alguien abre la publicación y elige ver el contacto.",
      ],
      [
        "Pagos",
        "Los pagos de los planes los procesa Stripe. Huellita Perdida no recibe ni guarda los datos de tu tarjeta.",
      ],
      [
        "Tus derechos",
        "Puedes pedir el acceso, la corrección o la eliminación de tus datos, o la baja de tus publicaciones, mediante el formulario de Ayuda. Tus publicaciones también las puedes eliminar tú mismo desde el detalle de cada una.",
      ],
      [
        "Servicios que usamos",
        "El sitio funciona con Supabase (cuentas y base de datos), Stripe (pagos), GitHub Pages y Render (alojamiento).",
      ],
    ],
  },
  terminos: {
    title: "Términos de uso",
    updated: "21 de noviembre de 2026",
    sections: [
      [
        "Uso del sitio",
        "Huellita Perdida sirve para publicar mascotas perdidas, encontradas o en adopción. Debes publicar información veraz y sobre mascotas reales.",
      ],
      [
        "Contenido prohibido",
        "No se permite publicar contenido falso, ofensivo o engañoso, vender animales, ni usar los datos de contacto de otras personas para fines distintos a ayudar a una mascota. Podemos retirar publicaciones que incumplan estas reglas.",
      ],
      [
        "Tu responsabilidad",
        "Eres responsable de lo que publicas. Antes de entregar o recibir una mascota, sigue las recomendaciones de seguridad de la sección Ayuda: reúnete en lugares públicos y pide pruebas de que la mascota es tuya.",
      ],
      [
        "Planes de pago",
        "Reportar mascotas perdidas o encontradas es gratis. Los planes Refugio Pro y Negocio Premium se cobran en pesos mexicanos mediante Stripe y amplían el límite de adopciones activas.",
      ],
      [
        "Sin garantías",
        "El sitio se ofrece tal cual, como prototipo académico. No garantizamos que una mascota sea encontrada ni la disponibilidad ininterrumpida del servicio.",
      ],
    ],
  },
};

export default function LegalDialog({ doc, onClose }) {
  useEffect(() => {
    if (!doc) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [doc, onClose]);

  const content = doc ? DOCS[doc] : null;
  if (!content) return null;

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="auth-dialog legal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X />
        </button>
        <h2 id="legal-title">{content.title}</h2>
        <p className="auth-sub">Última actualización: {content.updated}</p>
        <div className="legal-body">
          {content.sections.map(([heading, text]) => (
            <div key={heading}>
              <h3>{heading}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
