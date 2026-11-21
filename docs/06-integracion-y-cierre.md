# Integración de documentos, conclusiones y trabajo futuro

## Documentos generados en el curso

| Documento | Ubicación en el repositorio |
|---|---|
| Planteamiento del problema, contexto y justificación | `docs/01-planeacion/01-planteamiento-del-problema.md` |
| Planeación y objetivos | `docs/01-planeacion/02-planeacion-y-objetivos.md` |
| Matriz de responsabilidades | `docs/01-planeacion/03-matriz-de-responsabilidades.md` |
| Diagrama de Gantt | `docs/01-planeacion/04-diagrama-de-gantt.md` |
| Requerimientos | `docs/02-requerimientos/requerimientos.md` |
| Carta de navegación | `docs/03-diseno/01-carta-de-navegacion.md` |
| Wireframes | `docs/03-diseno/02-wireframes.md` |
| Casos de uso | `docs/03-diseno/03-casos-de-uso.md` |
| CMS o framework seleccionado | `docs/04-tecnologia/framework-seleccionado.md` |
| Prototipos y maquetas | `docs/05-prototipos/prototipos-y-maquetas.md` |
| Diagramas e imágenes | `docs/assets/` |
| Código fuente del prototipo | `frontend/` y `backend/` |
| Esquema de base de datos | `backend/supabase/schema.sql` |
| Despliegue automatizado | `.github/workflows/deploy-frontend.yml` y `render.yaml` |

## Conclusiones

Huellitas parte de un problema concreto y cotidiano y lo resuelve con una aplicación ligera, de costo de operación bajo y con privacidad desde el diseño. El curso permitió recorrer el ciclo completo: planteamiento, planeación, requerimientos, diseño, selección tecnológica y prototipo, cada uno documentado y enlazado con el siguiente.

La decisión de usar un framework en lugar de un CMS se sostiene en la naturaleza del producto: es una aplicación con lógica propia, no un sitio de contenido. A cambio, el equipo asume la construcción de la administración y la moderación, que quedan como trabajo futuro.

## Limitaciones actuales y trabajo futuro

| Prioridad | Mejora |
|---|---|
| Alta | Inicio de sesión y almacenamiento de reportes en base de datos compartida (hoy se guardan en el navegador). |
| Alta | Activar los planes únicamente desde el webhook firmado de Stripe. El servidor aún expone una ruta de registro de éxito que no verifica el pago. |
| Media | Moderación de reportes y verificación formal de refugios. |
| Media | Compartir por WhatsApp y notificaciones por correo. |
| Baja | Estadísticas de vistas para cuentas con plan de pago. |
| Baja | Pruebas automatizadas más allá de la prueba de humo existente (`npm run test:gold`). |
