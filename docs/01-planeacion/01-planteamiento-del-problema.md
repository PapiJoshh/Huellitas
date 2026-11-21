# Planteamiento del problema, contexto y justificación

## Nombre del proyecto

**Huellita Perdida (Huellitas)** es una aplicación web para reportar mascotas perdidas o encontradas, publicar mascotas en adopción y ofrecer planes de pago a refugios, veterinarias y negocios que gestionan adopciones.

## Contexto

Cuando una mascota se pierde, las primeras horas son decisivas. Hoy la difusión se hace sobre todo en redes sociales, grupos de vecinos y mensajes reenviados. La información queda dispersa, se mezcla con otras publicaciones y se pierde en pocos días. Quien encuentra a un animal sin identificación enfrenta el mismo problema: no sabe dónde publicar ni cómo confirmar que quien lo reclama es su familia.

La adopción responsable tiene un reto similar. Los refugios pequeños y las veterinarias publican a sus animales en perfiles personales, sin un lugar común donde las personas interesadas puedan comparar y filtrar por ciudad, tamaño o estado de vacunación.

## Planteamiento del problema

No existe un espacio sencillo y gratuito, orientado a ciudades de México, donde una persona pueda publicar un reporte con los datos clave de su mascota, consultar reportes de su ciudad y proteger sus datos de contacto. Tampoco existe uno donde los refugios puedan dar visibilidad sostenida a sus adopciones.

Las consecuencias son tres:

- Los reportes tienen poco alcance y vida corta.
- Las personas exponen su teléfono públicamente, con riesgo de contactos indeseados o fraudes.
- Los refugios no cuentan con una herramienta propia para destacar y administrar sus adopciones.

## Justificación

Huellitas propone un tablón centralizado con filtros por tipo y ciudad, un formulario guiado que asegura que cada reporte tenga la información necesaria, y un manejo de privacidad donde el teléfono solo se muestra cuando alguien abre la publicación y decide ver el contacto.

El proyecto es viable por tres razones:

1. **Necesidad social clara.** Atiende un problema cotidiano y sensible para muchas familias.
2. **Modelo de sostenibilidad.** Reportar es siempre gratis. Los ingresos vienen de los planes de pago para refugios y negocios (Refugio Pro y Negocio Premium), que pagan por más adopciones activas, insignia de verificación y publicaciones destacadas.
3. **Costo de operación bajo.** Se apoya en servicios con plan gratuito (GitHub Pages, Render y Supabase) y en Stripe, que no cobra por modo de prueba y descuenta comisión solo por pago real.

## Usuarios

| Perfil | Necesidad principal |
|---|---|
| Persona que perdió a su mascota | Publicar rápido y llegar a su ciudad |
| Persona que encontró una mascota | Avisar y encontrar a la familia sin exponer sus datos |
| Persona que quiere adoptar | Ver perros en adopción y filtrarlos |
| Refugio, veterinaria o negocio | Publicar más adopciones, ganar confianza y visibilidad |
