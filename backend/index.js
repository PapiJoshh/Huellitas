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

app.post('/api/create-checkout-session', async (req, res) => {
  const { planId, businessName, email } = req.body || {};
  const prices = { pro: 24900, premium: 49900 };

  if (!prices[planId]) return res.status(400).json({ error: 'Plan inválido.' });

  if (!stripe) {
    return res.json({
      ok: true,
      demoMode: true,
      checkoutUrl: `/demo-payment?plan=${planId}`,
      message: 'Modo demo activo. Configura Stripe para pagos reales.',
    });
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
      customer_email: email || undefined,
      metadata: { planId, businessName: businessName || '', email: email || '' },
    });
    res.json({ ok: true, checkoutUrl: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/checkout/success', async (req, res) => {
  const { planId, businessName, email } = req.body || {};
  if (!['pro', 'premium'].includes(planId)) return res.status(400).json({ error: 'Plan inválido.' });

  if (supabase) {
    const { error } = await supabase.from('subscriptions').insert({
      plan_id: planId,
      business_name: businessName || 'Sin nombre',
      email: email || null,
      status: 'active',
    });
    if (error) console.error('Supabase insert error:', error.message);
  }
  res.json({ ok: true, message: 'Pago registrado correctamente.' });
});

app.post('/api/webhook/stripe', async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.json({ received: true, demo: true });
  try {
    const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed' && supabase) {
      const session = event.data.object;
      await supabase.from('subscriptions').upsert({
        stripe_session_id: session.id,
        plan_id: session.metadata.planId,
        business_name: session.metadata.businessName || 'Sin nombre',
        email: session.customer_email || session.metadata.email || null,
        status: 'active',
      });
    }
    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

app.listen(port, () => console.log(`API running on http://localhost:${port}`));
