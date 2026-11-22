# Planeación y objetivos del proyecto

## Objetivo general

Desarrollar una aplicación web que centralice reportes de mascotas perdidas, encontradas y en adopción para ciudades de México, protegiendo los datos de contacto de las personas y ofreciendo planes de pago a refugios y negocios.

## Objetivos específicos

1. Definir el problema, el alcance y los requerimientos funcionales y no funcionales del sistema.
2. Diseñar la estructura de navegación, los wireframes y las maquetas de la interfaz.
3. Seleccionar con criterios técnicos la tecnología con la que se construye el sistema.
4. Implementar un prototipo funcional con tablón de reportes, filtros, formulario de publicación, planes y cuenta.
5. Integrar un flujo de pago seguro mediante Stripe Checkout y registrar las suscripciones en una base de datos.
6. Publicar el prototipo en servicios de costo cero y documentar el proyecto en un repositorio organizado.

## Alcance

**Incluye:**

- Tablón de reportes (perdidos y encontrados) y de adopciones, con búsqueda y filtros.
- Formulario de publicación en tres pasos.
- Ventana de detalle con contacto bajo demanda y opción de marcar como resuelto.
- Planes Gratis, Refugio Pro y Negocio Premium con pago en Stripe Checkout.
- Registro de suscripciones en Supabase, activadas solo desde el webhook firmado de Stripe.
- Inicio de sesión con correo y contraseña (Supabase Auth) y reportes guardados en base de datos compartida.
- Compartir reportes por WhatsApp.
- Sección de ayuda con guías de seguridad y preguntas frecuentes.
- Panel de administración para moderar reportes, comentarios y usuarios.

**No incluye en esta etapa:**

- Notificaciones por correo.
- Verificación formal de refugios.
- Aplicación móvil nativa.

## Metodología

El equipo trabaja con el marco ágil **Scrum**, con entregas iterativas e incrementales. El seguimiento se lleva en un tablero **Kanban en Trello**, organizado en cuatro fases (toma de requerimientos, planeación, diseño y desarrollo), enlazado a un repositorio compartido en Google Drive con la asesora. Los tres pilares de Scrum se aplican así:

| Pilar | Cómo se aplica en el proyecto |
|---|---|
| Transparencia | Backlog, avances y dificultades visibles para todo el equipo y la asesora en Trello y Drive. |
| Inspección | Revisión de cada incremento (formularios, fotos, filtros, diseño responsivo) con criterios de aceptación. |
| Adaptación | Reordenar tarjetas y prioridades cuando la revisión detecta desviaciones. |

El control de versiones se lleva en GitHub y el despliegue del frontend se automatiza con GitHub Actions.

## Etapas del proyecto

| Etapa | Entregables | Periodo planeado |
|---|---|---|
| 1. Inicio | Planteamiento, objetivos y alcance | 7 – 25 de septiembre |
| 2. Definición | Matriz de responsabilidades, requerimientos, casos de uso | 21 de septiembre – 16 de octubre |
| 3. Diseño | Carta de navegación, selección de framework, wireframes, maquetas | 5 de octubre – 6 de noviembre |
| 4. Construcción | Frontend, backend y pagos, despliegue | 19 de octubre – 13 de noviembre |
| 5. Cierre | Pruebas, integración documental, entrega | 9 – 22 de noviembre |

## Riesgos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Suspensión por inactividad del servidor gratuito (Render) | Alta | Medio | Mensaje de error claro y modo demo de pago |
| Datos de pago expuestos | Baja | Alto | Uso de Stripe Checkout; la aplicación nunca recibe números de tarjeta |
| Publicación de reportes falsos o fraudulentos | Media | Alto | Contacto bajo demanda, consejos de seguridad y moderación como mejora futura |
| Atraso en la integración de tareas del equipo | Media | Medio | Entregables parciales por fase y revisión semanal |
| Límites de cuota de servicios gratuitos | Media | Bajo | Arquitectura portable a otros proveedores |
