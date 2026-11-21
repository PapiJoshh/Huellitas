import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

app.use(cors({ origin: true, credentials: true }));
app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, services: { stripe: !!stripe, supabase: !!supabase } });
});

// Identifica al usuario a partir del token de sesión de Supabase (Authorization: Bearer ...).
async function getUser(req) {
  if (!supabase) return null;
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  return error ? null : data.user;
}

app.post('/api/create-checkout-session', async (req, res) => {
  const { planId, businessName, email } = req.body || {};
  const prices = { pro: 24900, premium: 49900 };

  if (!prices[planId]) return res.status(400).json({ error: 'Plan inválido.' });

  if (!stripe) {
    return res.json({
      ok: true,
      demoMode: true,
      message: 'Modo demo activo. Configura Stripe para pagos reales.',
    });
  }

  // Con base de datos configurada, el pago se asocia a una cuenta verificada.
  const user = await getUser(req);
  if (supabase && !user) {
    return res.status(401).json({ error: 'Inicia sesión para contratar un plan.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: { name: `Huellita Perdida - ${planId}` },
          unit_amount: prices[planId],
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/?payment=success&plan=${planId}`,
      cancel_url: `${process.env.CLIENT_URL}/?payment=cancelled&plan=${planId}`,
      customer_email: user?.email || email || undefined,
      metadata: {
        planId,
        businessName: businessName || '',
        email: email || '',
        userId: user?.id || '',
      },
    });
    res.json({ ok: true, checkoutUrl: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// El plan solo se activa aquí: Stripe firma el evento y el usuario viene de la sesión verificada.
app.post('/api/webhook/stripe', async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.json({ received: true, demo: true });
  try {
    const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed' && supabase) {
      const session = event.data.object;
      const { error } = await supabase.from('subscriptions').upsert({
        stripe_session_id: session.id,
        user_id: session.metadata.userId || null,
        plan_id: session.metadata.planId,
        business_name: session.metadata.businessName || 'Sin nombre',
        email: session.customer_email || session.metadata.email || null,
        status: 'active',
      }, { onConflict: 'stripe_session_id' });
      if (error) {
        console.error('Supabase upsert error:', error.message);
        return res.status(500).send('No se pudo registrar la suscripción.');
      }
    }
    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

app.listen(port, () => console.log(`API running on http://localhost:${port}`));
