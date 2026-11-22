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
| Seguridad, privacidad y ética | `docs/04-tecnologia/seguridad-privacidad-y-etica.md` |
| Prototipos y maquetas | `docs/05-prototipos/prototipos-y-maquetas.md` |
| Diagramas e imágenes | `docs/assets/` |
| Código fuente del prototipo | Carpetas `frontend/` y `backend/` |
| Esquema de base de datos | `backend/supabase/schema.sql` |
| Despliegue automatizado | `.github/workflows/deploy-frontend.yml`, `render.yaml` |

## Conclusiones

Huellitas parte de un problema concreto y cotidiano y lo resuelve con una aplicación ligera, de costo de operación bajo y con privacidad desde el diseño. El curso permitió recorrer el ciclo completo: planteamiento, planeación, requerimientos, diseño, selección tecnológica y prototipo, cada uno documentado y enlazado con el siguiente.

La decisión de usar un framework en lugar de un CMS se sostiene en la naturaleza del producto: es una aplicación con lógica propia, no un sitio de contenido. A cambio, el equipo asumió la construcción de la administración y la moderación: el sitio cuenta con un panel para administradores, accesible con una sesión normal, desde el cual se revisa y retira contenido. La verificación formal de refugios y la moderación previa quedan como trabajo futuro.

## Limitaciones actuales y trabajo futuro

| Prioridad | Mejora |
|---|---|
| Alta | Configurar las variables del servidor en Render para activar los pagos con Stripe en producción (la base de datos, el inicio de sesión y el panel de administración ya funcionan en Supabase). |
| Media | Verificación formal de refugios, moderación previa de reportes y una cuenta de administrador por integrante con registro de acciones. |
| Media | Notificaciones por correo ante nuevos reportes en la ciudad. |
| Baja | Estadísticas de vistas para cuentas con plan de pago. |
| Baja | Pruebas automatizadas más allá de la prueba de humo existente (`npm run test:gold`). |
