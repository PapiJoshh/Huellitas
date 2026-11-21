# Prototipos y maquetas

La maqueta visual parte de los wireframes y define color, tipografía, imágenes y estados de la interfaz. Después se implementó como un **prototipo funcional** en React. Las imágenes siguientes son capturas del prototipo en ejecución.

- Frontend publicado: <https://papijoshh.github.io/Huellitas/>
- Código fuente: <https://github.com/PapiJoshh/Huellitas>

## Lenguaje visual

- Fondo claro, tarjetas con esquinas redondeadas y sombras suaves.
- Color de acción azul para botones y enlaces, verde para confirmaciones y verificación, y un acento distinto para cada tipo de reporte: perdidas, encontradas y adopciones.
- Tipografía sans-serif con jerarquía marcada para títulos.
- Iconografía lineal de la biblioteca Lucide.

## Inicio

![Pantalla de inicio](../assets/prototipo/inicio.jpg)

## Reportes

![Tablón de reportes](../assets/prototipo/reportes.jpg)

## Adopciones

![Tablón de adopciones](../assets/prototipo/adopciones.jpg)

## Cómo funciona

![Sección Cómo funciona](../assets/prototipo/como-funciona.jpg)

## Publicar

![Formulario de publicación](../assets/prototipo/publicar.jpg)

## Planes

![Planes y comparativa](../assets/prototipo/planes.jpg)

## Ayuda

![Sección de ayuda](../assets/prototipo/ayuda.jpg)

## Versión móvil

![Vista en teléfono](../assets/prototipo/movil.jpg)

## Cómo ejecutar el prototipo

```bash
npm install --prefix frontend
npm install --prefix backend
npm run dev
```

El frontend queda en `http://localhost:5173` y la API en `http://localhost:3001`. Sin claves de Stripe, el pago funciona en modo demostración.
