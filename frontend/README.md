# Huellita Perdida

Webapp de reportes y adopciones con planes para refugios y veterinarias.

## Ejecutar localmente

Desde la raíz del workspace:

```powershell
npm run dev
```

Desde la carpeta de la app:

```powershell
cd huellita-perdida
npm install
npm run dev
```

El backend correcto está en `huellita-perdida/server/index.js`. Por eso el comando que fallaba:

```powershell
node server/index.js
```

solo funciona después de entrar a `huellita-perdida`. Desde la raíz usa `npm run server`.

## Pago y base de datos

La implementación usa Stripe Checkout para no manejar números de tarjeta en esta app y Supabase para guardar suscripciones. Copia `.env.example` a `.env` dentro de `huellita-perdida` y configura:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
CLIENT_URL=http://localhost:5173
PORT=3001
```

Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase. En Stripe, configura el webhook público:

```text
https://TU-API.onrender.com/api/webhook/stripe
```

Activa al menos el evento `checkout.session.completed`. El webhook es la fuente confiable para activar la suscripción; no se deben activar planes solo porque el navegador volvió a la URL de éxito.

## Publicar sin pagar infraestructura

1. Sube el repositorio a GitHub.
2. Publica el frontend estático en GitHub Pages. Para Vite, configura el workflow de GitHub Actions para ejecutar `npm run build` dentro de `huellita-perdida` y publicar `huellita-perdida/dist`.
3. Publica el backend como Web Service en Render usando `huellita-perdida` como Root Directory, `npm install` como Build Command y `npm run server` como Start Command.
4. En Render agrega las variables de `.env.example` y cambia `CLIENT_URL` por la URL pública de GitHub Pages.
5. En el frontend cambia el proxy de desarrollo por `VITE_API_URL=https://TU-API.onrender.com` cuando se publique, porque GitHub Pages no puede ejecutar Express.

GitHub Pages, Supabase y los planes gratuitos de algunos proveedores pueden tener límites, suspensión por inactividad o cambios de cuota. Stripe no cobra por modo test; en modo live cobra comisión por cada pago real. No es posible cobrar dinero real sin una cuenta Stripe verificada.

## Tarjeta de prueba Stripe

En modo test usa `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC. Nunca subas `.env` ni claves secretas a GitHub.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
