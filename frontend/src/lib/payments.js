const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options) {
  return fetch(`${API_BASE}${path}`, options);
}

export async function createCheckoutSession({ planId, businessName, email }) {
  const response = await request('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, businessName, email }),
  });

  const data = await response.json();

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo registrar el pago.');
  }

  return data;
}
