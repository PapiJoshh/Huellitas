# Seguridad, privacidad y consideraciones éticas

Huellita Perdida maneja datos de personas (nombre y teléfono de quien publica) y de animales en situaciones delicadas. Por eso estas decisiones se tomaron desde el diseño y no como un añadido al final.

## Protección de datos personales

| Principio | Cómo se aplica en el sistema |
|---|---|
| Minimización | Solo se piden los datos necesarios: correo y contraseña para la cuenta; nombre y teléfono únicamente si la persona decide publicar un reporte. |
| Privacidad desde el diseño | El teléfono y el nombre de contacto viven en una tabla aparte (`report_contacts`). No viajan con la lista pública de reportes: se piden solo cuando alguien abre un reporte y pulsa «Ver contacto». |
| Control de la persona titular | Quien publica puede marcar su reporte como resuelto o eliminarlo en cualquier momento. |
| Transparencia | El sitio incluye un Aviso de privacidad y unos Términos de uso accesibles desde el pie de página, escritos en lenguaje sencillo. |
| Marco aplicable | El tratamiento de datos se alinea con los principios de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México): finalidad, consentimiento, información y seguridad. El texto final del aviso debe ser revisado por quien opere el sitio. |

## Seguridad técnica

| Medida | Descripción |
|---|---|
| Autenticación | Cuentas con correo y contraseña gestionadas por Supabase Auth; las contraseñas nunca se almacenan en texto plano ni pasan por el código del proyecto. |
| Control de acceso a nivel de fila | Cada tabla tiene políticas (Row Level Security): cada persona solo puede modificar o borrar lo que publicó. |
| Roles | El rol de administrador se guarda en una tabla (`admins`) sin permisos para el público; solo puede editarse desde el panel de Supabase. La función `is_admin()` valida el rol en el servidor, por lo que no se puede falsificar desde el navegador. |
| Llaves secretas | La llave pública (`anon`) es la única presente en el sitio. La llave de servicio, las llaves de Stripe y las variables del servidor viven únicamente como variables de entorno del despliegue y nunca en el repositorio. |
| Pagos | Los pagos se procesan en Stripe Checkout. El sistema no recibe ni guarda datos de tarjeta; solo se entera de que el pago fue exitoso mediante un webhook firmado. |
| Archivos | Las fotos se guardan en un bucket donde cada persona solo puede subir a su propia carpeta. |
| Abuso | Límite de adopciones activas en el plan gratuito, botón «Denunciar» en cada publicación y formulario de comentarios revisado por el administrador. |
| Transporte | Todo el tráfico va por HTTPS (GitHub Pages, Render y Supabase). |

## Consideraciones éticas

- **Bienestar animal.** El sitio no es un mercado de venta de animales. Está orientado a reunir mascotas perdidas con sus familias y a promover adopciones. Los planes de pago ofrecen visibilidad a refugios y veterinarias, nunca el derecho de vender animales.
- **Adopción responsable.** Los consejos de la sección de ayuda recuerdan verificar a quien adopta y a quien entrega, no pagar por adelantado y reunirse en lugares públicos.
- **Prevención de fraudes y engaños.** Es un riesgo conocido de los sitios de mascotas perdidas (falsos «rescatistas» que piden dinero). Por eso las advertencias de seguridad son visibles, existe la denuncia de publicaciones y el administrador puede retirarlas.
- **Moderación proporcional.** El administrador puede retirar contenido, pero no editar lo que otras personas escribieron ni ver contraseñas.
- **Honestidad del prototipo.** Los reportes de ejemplo que trae la base de datos usan teléfonos ficticios y existen solo para demostración. Antes de operar con público real deben eliminarse.
- **Propiedad de las fotos.** Quien publica una foto declara que tiene derecho a usarla; el sitio no reutiliza imágenes de terceros.
- **Accesibilidad.** Se cuidan el contraste en modo claro y oscuro, el enlace para saltar al contenido, el foco visible del teclado y las etiquetas para lectores de pantalla, para que más personas puedan usar el sitio.
- **Tratamiento justo de las personas.** El sistema no perfila, no vende datos ni muestra publicidad de terceros.

## Riesgos pendientes

| Riesgo | Mitigación recomendada |
|---|---|
| Spam o publicaciones falsas | Verificación de correo y moderación previa antes de operar con público abierto. |
| Datos de ejemplo visibles | Eliminar los reportes de demostración y las cuentas de prueba antes de publicar. |
| Cuenta de administrador compartida | Es práctica para el equipo, pero no permite saber quién hizo cada acción. A futuro conviene una cuenta por integrante y un registro de acciones. |
