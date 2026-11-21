import { useEffect, useState } from "react";
import { ShieldCheck, Trash2, Eye, CheckCircle2, RefreshCw } from "lucide-react";
import { deleteFeedback, fetchAdminData } from "./lib/data";

const TIPO = { perdido: "Perdido", encontrado: "Encontrado", adopcion: "Adopción" };
const FEEDBACK = { problema: "Problema", idea: "Idea", publicacion: "Denuncia" };

function day(value) {
  return value ? String(value).slice(0, 10) : "";
}

export default function AdminPanel({ reports, onOpen, onResolve, onDelete, notify }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  async function load() {
    setError(false);
    try {
      setData(await fetchAdminData());
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetchAdminData().then(
      (next) => !cancelled && setData(next),
      () => !cancelled && setError(true),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  async function removeFeedback(id) {
    if (!window.confirm("¿Eliminar este comentario?")) return;
    try {
      await deleteFeedback(id);
      setData((current) => ({
        ...current,
        feedback: current.feedback.filter((item) => item.id !== id),
      }));
      notify("Comentario eliminado.");
    } catch {
      notify("No se pudo eliminar el comentario.", "error");
    }
  }

  const needle = query.trim().toLowerCase();
  const rows = reports.filter(
    (report) =>
      !needle ||
      [report.nombre, report.ciudad, report.tipo, report.estado, report.publicadoPor]
        .join(" ")
        .toLowerCase()
        .includes(needle),
  );
  const active = reports.filter((report) => report.estado === "activo").length;

  return (
    <section id="admin" className="band admin-panel" aria-labelledby="admin-title">
      <div className="page-wrap">
        <div className="section-heading">
          <div>
            <h2 id="admin-title">
              <ShieldCheck aria-hidden="true" /> Panel de administración
            </h2>
            <p className="section-sub">
              Solo tú ves esta sección. Puedes revisar, resolver y eliminar cualquier
              publicación, y leer los comentarios y denuncias.
            </p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={load}>
            <RefreshCw /> Actualizar
          </button>
        </div>

        {error && (
          <p className="admin-empty" role="alert">
            No se pudieron cargar los datos del panel. Revisa que tu cuenta esté en la
            tabla <code>admins</code> y vuelve a intentar.
          </p>
        )}

        <dl className="admin-stats">
          <div>
            <dt>Usuarios</dt>
            <dd>{data ? data.profiles.length : "…"}</dd>
          </div>
          <div>
            <dt>Reportes</dt>
            <dd>{reports.length}</dd>
          </div>
          <div>
            <dt>Activos</dt>
            <dd>{active}</dd>
          </div>
          <div>
            <dt>Comentarios</dt>
            <dd>{data ? data.feedback.length : "…"}</dd>
          </div>
        </dl>

        <h3>Publicaciones</h3>
        <input
          className="admin-search"
          type="search"
          placeholder="Buscar por nombre, ciudad, tipo o estado"
          aria-label="Buscar publicaciones"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mascota</th>
                <th>Tipo</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Contacto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((report) => {
                const contact = data?.contacts[report.id];
                return (
                  <tr key={report.id}>
                    <td>
                      <strong>{report.nombre || "Sin nombre"}</strong>
                      <small>{report.publicadoPor || day(report.fecha)}</small>
                    </td>
                    <td>{TIPO[report.tipo] || report.tipo}</td>
                    <td>{report.ciudad}</td>
                    <td>{report.estado === "resuelto" ? "Resuelto" : "Activo"}</td>
                    <td>
                      {contact ? (
                        <>
                          {contact.nombre}
                          <small>{contact.telefono}</small>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span className="admin-actions">
                        <button
                          type="button"
                          className="icon-button"
                          title="Ver publicación"
                          aria-label={`Ver ${report.nombre || "publicación"}`}
                          onClick={() => onOpen(report.id)}
                        >
                          <Eye />
                        </button>
                        {report.estado !== "resuelto" && (
                          <button
                            type="button"
                            className="icon-button"
                            title="Marcar como resuelto"
                            aria-label={`Marcar como resuelto ${report.nombre || "publicación"}`}
                            onClick={() => onResolve(report.id)}
                          >
                            <CheckCircle2 />
                          </button>
                        )}
                        <button
                          type="button"
                          className="icon-button is-danger"
                          title="Eliminar publicación"
                          aria-label={`Eliminar ${report.nombre || "publicación"}`}
                          onClick={() => onDelete(report)}
                        >
                          <Trash2 />
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!rows.length && <p className="admin-empty">No hay publicaciones con ese filtro.</p>}
        </div>

        <h3>Comentarios y denuncias</h3>
        {data && !data.feedback.length && (
          <p className="admin-empty">Todavía no hay comentarios.</p>
        )}
        <ul className="admin-feedback">
          {data?.feedback.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{FEEDBACK[item.tipo] || item.tipo}</strong>
                <small>
                  {day(item.created_at)}
                  {item.contacto ? ` · ${item.contacto}` : ""}
                </small>
                <p>{item.mensaje}</p>
                {item.report_id && (
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => onOpen(item.report_id)}
                  >
                    Ver publicación denunciada
                  </button>
                )}
              </div>
              <button
                type="button"
                className="icon-button is-danger"
                title="Eliminar comentario"
                aria-label="Eliminar comentario"
                onClick={() => removeFeedback(item.id)}
              >
                <Trash2 />
              </button>
            </li>
          ))}
        </ul>

        <h3>Usuarios registrados</h3>
        <ul className="admin-users">
          {data?.profiles.map((profile) => (
            <li key={profile.user_id}>
              <span>{profile.email || "Sin correo"}</span>
              <small>
                {profile.nombre_negocio || "Particular"} · {day(profile.created_at)}
              </small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
