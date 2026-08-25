const API_BASE = 'https://huellitas-fpng.onrender.com';

async function request(path, options) {
  if (!API_BASE) {
    throw new Error('Falta configurar VITE_API_URL con la URL pública de Render.');
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(`${API_BASE}${path}`, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('El servidor de pagos tardó demasiado. Despierta el servicio de Render e inténtalo otra vez.');
    }
    throw new Error('No se pudo conectar con el servidor de pagos. Verifica que la API de Render esté activa.');
  }
}

export async function createCheckoutSession({ planId, businessName, email }) {
  const response = await request('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, businessName, email }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo iniciar el pago.');
  }

  return data;
}

export async function registerSuccessfulPayment({ planId, businessName, email }) {
  const response = await request('/api/checkout/success', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, businessName, email }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo registrar el pago.');
  }

  return data;
}
