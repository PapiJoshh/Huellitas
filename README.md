# Huellita Perdida

## Estructura

- `frontend/`: React + Vite, publicado en GitHub Pages.
- `backend/`: Express + Stripe + Supabase, publicado como servicio web.

## Comandos

```powershell
npm install
npm run dev
npm run build
npm run server
```

El backend correcto es `backend/index.js`. Ya no es necesario ejecutar `node server/index.js`.

## Publicación gratuita

1. Sube este repositorio a GitHub.
2. Publica `frontend` en GitHub Pages mediante GitHub Actions.
3. Publica `backend` en Render con `npm install` y `npm start`.
4. En Render configura las variables de `backend/.env.example`.
5. En GitHub Actions configura `VITE_API_URL` con la URL pública de Render.
6. Ejecuta `backend/supabase/schema.sql` en Supabase.
7. Configura el webhook de Stripe en `https://TU-API.onrender.com/api/webhook/stripe`.

GitHub Pages, Render y Supabase tienen límites gratuitos. Stripe Test es gratis para probar; Stripe Live cobra comisión por cada pago real y requiere verificar una cuenta.