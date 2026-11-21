import { supabase } from "./supabase";

const COLUMNS =
  "id,user_id,tipo,nombre,foto_url,color,tamano,ciudad,fecha,descripcion,edad,vacunado,esterilizado,destacado,estado,publicado_por,vistas,contactos_recibidos,created_at";

function fromRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    tipo: row.tipo,
    nombre: row.nombre,
    foto: row.foto_url,
    color: row.color,
    tamano: row.tamano,
    ciudad: row.ciudad,
    fecha: row.fecha,
    descripcion: row.descripcion,
    edad: row.edad,
    vacunado: row.vacunado,
    esterilizado: row.esterilizado,
    destacado: row.destacado,
    estado: row.estado,
    publicadoPor: row.publicado_por,
    vistas: row.vistas,
    contactosRecibidos: row.contactos_recibidos,
    // El contacto NO viaja con el reporte: se pide aparte con revealContact().
    contactoNombre: "",
    contactoTelefono: "",
  };
}

export function isAdoptionLimitError(error) {
  return Boolean(error?.message?.includes("LIMITE_ADOPCIONES"));
}

export async function fetchReports() {
  const { data, error } = await supabase
    .from("reports")
    .select(COLUMNS)
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) throw error;
  return data.map(fromRow);
}

async function uploadPhoto(dataUrl, userId) {
  const blob = await (await fetch(dataUrl)).blob();
  const ext = blob.type === "image/png" ? "png" : "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("fotos")
    .upload(path, blob, { contentType: blob.type || "image/jpeg" });
  if (error) throw error;
  return supabase.storage.from("fotos").getPublicUrl(path).data.publicUrl;
}

export async function createReport(form, { userId, publicadoPor, destacado }) {
  const fotoUrl = form.foto ? await uploadPhoto(form.foto, userId) : null;

  const { data, error } = await supabase
    .from("reports")
    .insert({
      tipo: form.tipo,
      nombre: form.nombre.trim(),
      foto_url: fotoUrl,
      color: form.color,
      tamano: form.tamano,
      ciudad: form.ciudad,
      fecha: form.fecha,
      descripcion: form.descripcion.trim(),
      edad: form.edad,
      vacunado: form.vacunado,
      esterilizado: form.esterilizado,
      destacado,
      publicado_por: publicadoPor,
    })
    .select("id")
    .single();
  if (error) throw error;

  const { error: contactError } = await supabase.from("report_contacts").insert({
    report_id: data.id,
    nombre: form.contactoNombre.trim(),
    telefono: form.contactoTelefono.trim(),
  });
  if (contactError) {
    await supabase.from("reports").delete().eq("id", data.id);
    throw contactError;
  }
  return data.id;
}

export async function markResolved(id) {
  const { error } = await supabase
    .from("reports")
    .update({ estado: "resuelto" })
    .eq("id", id);
  if (error) throw error;
}

export async function removeReport(id) {
  const { error } = await supabase.from("reports").delete().eq("id", id);
  if (error) throw error;
}

export async function revealContact(id) {
  const { data, error } = await supabase.rpc("reveal_contact", { rid: id });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row
    ? { nombre: row.contacto_nombre, telefono: row.contacto_telefono }
    : null;
}

export async function bumpView(id) {
  await supabase.rpc("bump_view", { rid: id }).then(
    () => {},
    () => {},
  );
}

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("tipo,nombre_negocio,email")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveProfile(userId, account) {
  const { error } = await supabase.from("profiles").upsert({
    user_id: userId,
    tipo: account.tipo,
    nombre_negocio: account.nombreNegocio,
    email: account.email,
  });
  if (error) throw error;
}

export async function fetchActivePlan(userId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0]?.plan_id || "gratis";
}

export async function sendFeedback({ tipo, mensaje, contacto, reportId }) {
  const row = {
    tipo,
    mensaje: mensaje.trim(),
    contacto: (contacto || "").trim(),
    report_id: reportId || null,
    pagina: window.location.pathname + window.location.hash,
  };
  if (supabase) {
    const { error } = await supabase.from("feedback").insert(row);
    if (error) throw error;
    return;
  }
  // Modo local: se guarda en el navegador para no perder el mensaje.
  const key = "huellita-perdida-feedback";
  const saved = JSON.parse(window.localStorage.getItem(key) || "[]");
  saved.push({ ...row, fecha: new Date().toISOString() });
  window.localStorage.setItem(key, JSON.stringify(saved));
}
