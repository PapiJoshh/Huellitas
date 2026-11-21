import { useEffect, useState } from "react";
import { LogIn, X } from "lucide-react";
import { supabase } from "./lib/supabase";

export default function AuthPanel({ open, onClose, onDone }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

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
    setInfo("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        onDone("Sesión iniciada.");
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        if (data.session) {
          onDone("Cuenta creada. ¡Bienvenido!");
        } else {
          setInfo(
            "Te enviamos un correo para confirmar tu cuenta. Después inicia sesión.",
          );
          setMode("login");
        }
      }
      setPassword("");
    } catch (authError) {
      const text = String(authError.message || "");
      if (/invalid login/i.test(text)) setError("Correo o contraseña incorrectos.");
      else if (/already registered/i.test(text)) setError("Ese correo ya tiene una cuenta. Inicia sesión.");
      else if (/not confirmed/i.test(text)) setError("Confirma tu correo antes de iniciar sesión.");
      else setError("No se pudo completar la operación. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X />
        </button>
        <h2 id="auth-title">{isLogin ? "Inicia sesión" : "Crea tu cuenta"}</h2>
        <p className="auth-sub">
          {isLogin
            ? "Entra para publicar reportes y administrar tus publicaciones."
            : "Es gratis. Solo necesitas un correo y una contraseña."}
        </p>
        <form onSubmit={submit} className="auth-form">
          <label className="field-stack">
            <span>Correo electrónico</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </label>
          <label className="field-stack">
            <span>Contraseña</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          {info && <p className="auth-info" role="status">{info}</p>}
          <button className="btn btn-primary auth-submit" disabled={busy}>
            <LogIn /> {busy ? "Un momento…" : isLogin ? "Entrar" : "Crear cuenta"}
          </button>
        </form>
        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode(isLogin ? "signup" : "login");
            setError("");
            setInfo("");
          }}
        >
          {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </section>
    </div>
  );
}
