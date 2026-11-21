const API_BASE =
  import.meta.env.VITE_API_URL || 'https://huellitas-fpng.onrender.com';

async function request(path, options) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(`${API_BASE}${path}`, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('El servidor de pagos tardó demasiado. Despierta el servicio de Render e inténtalo otra vez.', { cause: error });
    }
    throw new Error('No se pudo conectar con el servidor de pagos. Verifica que la API de Render esté activa.', { cause: error });
  }
}

export async function createCheckoutSession({ planId, businessName, email, accessToken }) {
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await request('/api/create-checkout-session', {
    method: 'POST',
    headers,
    body: JSON.stringify({ planId, businessName, email }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo iniciar el pago.');
  }

  return data;
}
