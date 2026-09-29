# Cómo funciona Atlas

## 28 de septiembre de 2026 — Rediseño visual

🧒 La página necesitaba mostrar mejor sus viajes sin cambiar el formulario ni añadir un sistema nuevo.
La portada es como la vitrina de una agencia: el avión atrae la mirada y los botones indican por dónde entrar.
Cada sala del sitio conserva su contenido (en programación, HTML), mientras una sola guía visual ordena colores, espacios y tamaños (CSS).
Las fotos de los destinos son postales del mismo archivador: ya estaban en el proyecto y ahora aparecen también en la portada.
En celular, el menú se abre como una pequeña puerta plegable (elemento `details`), sin necesitar programación adicional.
Si una foto falla, su descripción alternativa ayuda a entenderla; si el diseño se desordena, lo vigilamos con pruebas visuales en varios tamaños.
Este cambio no conecta el formulario a PHP ni confirma reservas: esa parte sigue pendiente de una implementación separada.

## 29 de septiembre de 2026 — Video de llegada y guía para elegir ruta

🧒 Cómo funciona por dentro
La portada ahora busca emocionar y orientar: el avión aterrizando es la ventana de entrada, no una función necesaria para navegar.
El clip local (video HTML) se carga solo si el visitante no pidió menos movimiento, como una pantalla que se apaga cuando alguien prefiere quietud.
La reproducción salta los primeros segundos de pista vacía y repite el tramo de llegada, para que el avión aparezca pronto al entrar.
La foto anterior queda detrás como respaldo (poster): si el video falla o no se permite, la vitrina sigue completa y legible.
El botón de pausa usa una instrucción pequeña (JavaScript) para detener o volver a reproducir el clip sin afectar los enlaces.
La preferencia de menos movimiento (`prefers-reduced-motion`) funciona como un aviso de “déjame la foto quieta”; entonces ni descargamos el clip.
El tablero agrupa los cinco destinos por interés y las fichas añaden un primer recorrido y enlaces a fuentes oficiales, como un archivador bien rotulado.
Si fallara un enlace, el clip o el botón, lo vigilan siete pruebas automáticas y una revisión visual en escritorio y celular; el formulario existente no cambió.

El video es [“Airplane Landing over Cars” de Salva F. Ayala en Pexels](https://www.pexels.com/video/airplane-landing-over-cars-10406880/), versión 960 × 540 de 1,68 MB. Se usa bajo la [licencia gratuita de Pexels](https://www.pexels.com/license/) y se acredita en la portada. Antes había solo una foto estática; ahora esa misma foto es el respaldo accesible del video.

## Glosario

- **HTML** → las salas y letreros del edificio: estructura y contenido.
- **CSS** → la decoración y distribución del edificio: apariencia y adaptación a pantallas.
- **`details`** → una puerta plegable que el navegador ya sabe abrir y cerrar.
- **Texto alternativo** → la descripción escrita de una foto cuando no se puede ver.
- **Video HTML** → una ventana con imágenes en movimiento dentro de la página.
- **Poster** → la fotografía de respaldo que queda cuando el video no se reproduce.
- **JavaScript** → el interruptor que responde al botón de pausa.
- **`prefers-reduced-motion`** → la señal del visitante para pedir una página con menos movimiento.
