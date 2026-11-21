import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import { sendFeedback } from "./lib/data";

const OPTIONS = [
  ["problema", "Algo no funciona"],
  ["idea", "Tengo una idea"],
  ["publicacion", "Denunciar una publicación"],
];

export default function FeedbackDialog({ open, preset, onClose, onSent }) {
  const [tipo, setTipo] = useState(preset?.tipo || "problema");
  const [mensaje, setMensaje] = useState("");
  const [contacto, setContacto] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (mensaje.trim().length < 5) {
      setError("Cuéntanos un poco más (mínimo 5 caracteres).");
      return;
    }
    setBusy(true);
    try {
      await sendFeedback({
        tipo,
        mensaje,
        contacto,
        reportId: preset?.reportId,
      });
      setMensaje("");
      setContacto("");
      onSent(
        tipo === "publicacion"
          ? "Recibimos tu denuncia. Gracias por avisar."
          : "¡Gracias! Recibimos tu mensaje.",
      );
    } catch {
      setError("No se pudo enviar. Inténtalo de nuevo en un momento.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X />
        </button>
        <h2 id="feedback-title">Cuéntanos qué pasó</h2>
        <p className="auth-sub">
          Leemos cada mensaje. Si quieres que te respondamos, deja un correo o
          teléfono.
        </p>
        <form onSubmit={submit} className="auth-form">
          <label className="field-stack">
            <span>Tipo de mensaje</span>
            <select value={tipo} onChange={(event) => setTipo(event.target.value)}>
              {OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-stack">
            <span>Mensaje</span>
            <textarea
              required
              rows={5}
              maxLength={1000}
              value={mensaje}
              onChange={(event) => setMensaje(event.target.value)}
              placeholder="Describe el problema, la idea o por qué denuncias la publicación"
            />
          </label>
          <label className="field-stack">
            <span>Correo o teléfono (opcional)</span>
            <input
              maxLength={120}
              value={contacto}
              onChange={(event) => setContacto(event.target.value)}
              placeholder="Para poder responderte"
            />
          </label>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-primary auth-submit" disabled={busy}>
            <Send /> {busy ? "Enviando…" : "Enviar"}
          </button>
        </form>
      </section>
    </div>
  );
}
