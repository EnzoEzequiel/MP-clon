# Libre Bank — prototipo educativo

Prototipo responsive de una interfaz de finanzas educativas inspirado en la **estructura y el ritmo general** de la grabación de referencia. No utiliza marcas, logotipos ni textos comerciales de la referencia.

## Cómo probarlo

1. Descargá y descomprimí la carpeta.
2. Abrí `index.html` en un navegador moderno.
3. En celular, probá el flujo en orientación vertical. En escritorio, el prototipo mantiene un ancho de aplicación de hasta 430 px.

También podés levantar un servidor local desde esta carpeta:

```bash
python -m http.server 8000
```

Después abrí `http://localhost:8000`.

## Flujo incluido

Inicio → Enviar → elegir destinatario → elegir cuenta destino → ingresar importe con teclado propio → revisar → confirmar práctica → resultado.

Los datos son ficticios. El prototipo no tiene backend, no consulta bancos y no mueve dinero.

## Archivos

- `index.html`: estructura y metadatos.
- `styles.css`: diseño responsive, tokens visuales y animaciones.
- `app.js`: estado de la interfaz, navegación y eventos.

No requiere npm, frameworks, Tailwind ni imágenes externas. El monograma LB y los íconos son vectoriales inline.
