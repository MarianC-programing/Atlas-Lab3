# Cómo funciona Atlas

## 28 de septiembre de 2026 — Rediseño visual

🧒 La página necesitaba mostrar mejor sus viajes sin cambiar el formulario ni añadir un sistema nuevo.
La portada es como la vitrina de una agencia: el avión atrae la mirada y los botones indican por dónde entrar.
Cada sala del sitio conserva su contenido (en programación, HTML), mientras una sola guía visual ordena colores, espacios y tamaños (CSS).
Las fotos de los destinos son postales del mismo archivador: ya estaban en el proyecto y ahora aparecen también en la portada.
En celular, el menú se abre como una pequeña puerta plegable (elemento `details`), sin necesitar programación adicional.
Si una foto falla, su descripción alternativa ayuda a entenderla; si el diseño se desordena, lo vigilamos con pruebas visuales en varios tamaños.
Este cambio no conecta el formulario a PHP ni confirma reservas: esa parte sigue pendiente de una implementación separada.

## Glosario

- **HTML** → las salas y letreros del edificio: estructura y contenido.
- **CSS** → la decoración y distribución del edificio: apariencia y adaptación a pantallas.
- **`details`** → una puerta plegable que el navegador ya sabe abrir y cerrar.
- **Texto alternativo** → la descripción escrita de una foto cuando no se puede ver.
