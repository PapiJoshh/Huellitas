# Requerimientos

Los requerimientos se clasifican por tipo y se indica su estado actual en el prototipo: **Implementado**, **Parcial** o **Planeado**.

## Requerimientos funcionales

| ID | Requerimiento | Prioridad | Estado |
|---|---|---|---|
| RF-01 | El sistema debe mostrar un tablón con los reportes de mascotas perdidas y encontradas. | Alta | Implementado |
| RF-02 | El sistema debe permitir buscar y filtrar por texto, tipo de reporte, ciudad y estado activo. | Alta | Implementado |
| RF-03 | El sistema debe permitir publicar un reporte (perdida, encontrada o en adopción) con foto, nombre, color, tamaño, ciudad, fecha, descripción de hasta 500 caracteres y datos de contacto. | Alta | Implementado |
| RF-04 | El sistema debe ocultar el teléfono en las tarjetas y mostrarlo solo cuando la persona lo solicite en el detalle. | Alta | Implementado |
| RF-05 | El sistema debe permitir marcar un reporte como resuelto y mostrarlo en «Ya volvieron a casa». | Media | Implementado |
| RF-06 | El sistema debe mostrar un tablón de adopciones con edad, vacunación y esterilización. | Alta | Implementado |
| RF-07 | El sistema debe limitar el plan gratuito a tres adopciones activas. | Media | Implementado |
| RF-08 | El sistema debe ofrecer los planes Gratis, Refugio Pro y Negocio Premium, con tabla comparativa. | Alta | Implementado |
| RF-09 | El sistema debe procesar el pago de un plan mediante Stripe Checkout, con modo demostración cuando no hay claves configuradas. | Alta | Implementado |
| RF-10 | El sistema debe registrar las suscripciones en la base de datos al recibir la confirmación de pago de Stripe. | Alta | Implementado |
| RF-11 | El sistema debe mostrar insignia de verificado y publicaciones destacadas a las cuentas con plan de pago. | Media | Implementado |
| RF-12 | El sistema debe permitir configurar el perfil de la cuenta (tipo, nombre del negocio y correo) y listar sus publicaciones de adopción. | Media | Implementado |
| RF-13 | El sistema debe ofrecer estadísticas de interés por publicación. Hoy se registra el número de contactos recibidos; las vistas y su visualización están pendientes. | Baja | Parcial |
| RF-14 | El sistema debe ofrecer guías de ayuda, recomendaciones de seguridad y preguntas frecuentes. | Media | Implementado |
| RF-15 | El sistema debe contar con inicio de sesión y guardar los reportes en una base de datos compartida. | Alta | Planeado |
| RF-16 | El sistema debe permitir compartir un reporte por WhatsApp. | Media | Planeado |
| RF-17 | El sistema debe enviar notificaciones por correo ante nuevos reportes en la ciudad de la persona. | Baja | Planeado |
| RF-18 | El sistema debe contar con moderación de reportes y verificación formal de refugios. | Media | Planeado |

## Requerimientos no funcionales

| ID | Categoría | Requerimiento | Estado |
|---|---|---|---|
| RNF-01 | Usabilidad | La interfaz debe ser clara, con un formulario guiado de tres pasos y campos obligatorios señalados. | Implementado |
| RNF-02 | Adaptabilidad | La interfaz debe adaptarse a pantallas de computadora y teléfono. | Implementado |
| RNF-03 | Accesibilidad | Los controles deben tener etiquetas accesibles y respetar la preferencia de movimiento reducido del sistema. | Implementado |
| RNF-04 | Rendimiento | El paquete de JavaScript del frontend debe mantenerse ligero (la compilación actual pesa cerca de 75 KB comprimidos). | Implementado |
| RNF-05 | Seguridad | La aplicación no debe recibir ni almacenar datos de tarjeta; el cobro se delega en Stripe. | Implementado |
| RNF-06 | Seguridad | Las claves secretas deben guardarse en variables de entorno y nunca en el repositorio. | Implementado |
| RNF-07 | Seguridad | La tabla de suscripciones debe tener seguridad por filas (RLS) y ser escrita solo desde el servidor. | Implementado |
| RNF-08 | Seguridad | El webhook de Stripe debe validar la firma del evento. | Implementado |
| RNF-09 | Privacidad | Los datos de contacto deben mostrarse únicamente por decisión de quien consulta la publicación. | Implementado |
| RNF-10 | Disponibilidad | El frontend debe publicarse en hosting estático y el backend en un servicio web con plan gratuito. | Implementado |
| RNF-11 | Mantenibilidad | El código debe organizarse en componentes y pasar las reglas de ESLint del proyecto. | Implementado |
| RNF-12 | Portabilidad | El sistema debe poder ejecutarse localmente con un solo comando desde la raíz del repositorio. | Implementado |
| RNF-13 | Compatibilidad | El sistema debe funcionar en las versiones recientes de Chrome, Edge, Firefox y Safari. | Por verificar |

## Reglas de negocio

- Reportar mascotas perdidas o encontradas es siempre gratuito.
- El plan Gratis permite hasta tres adopciones activas; Pro y Premium no tienen límite.
- Refugio Pro cuesta **$249 MXN al mes**; Negocio Premium, **$499 MXN al mes**.
- Solo las cuentas con plan de pago muestran insignia de verificado y pueden destacar publicaciones.
- Un plan se activa únicamente con la confirmación de pago de Stripe.

## Restricciones

- Presupuesto de infraestructura de costo cero para el prototipo.
- Duración del proyecto limitada al ciclo del curso.
- El cobro real requiere una cuenta de Stripe verificada.
