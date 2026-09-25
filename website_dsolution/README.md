# D-Solution Website for Odoo Community master (19.5 alpha / pre-20)

Primera versión de migración de `d-solution.org` a Odoo Website.

## Objetivo

Convertir la web actual de Next.js/Directus en una web nativa de Odoo, manteniendo la identidad visual y preparando el flujo comercial:

`Website -> formulario -> CRM -> presupuesto/ventas -> proyecto -> facturación`

## Incluye en v0.1

- Home premium inspirada en la web actual.
- Header transparente que cambia al hacer scroll.
- Hero con vídeo.
- 6 servicios y sus URLs actuales.
- Sección Proceso.
- Estadísticas.
- Ecosistema con marquee animado.
- Portafolio inicial limpio (sin contenido adulto/de prueba de la web actual).
- Formulario visual integrado con Odoo `crm.lead`.
- Página de gracias.
- Responsive móvil/tablet/escritorio.
- Sin Chatwoot, tal como se pidió.

## Dependencias

El módulo declara:

- `website`
- `website_crm`

Al instalarlo, Odoo instalará las dependencias necesarias (incluido CRM si aún no está instalado).

## Medios en esta versión

Para poder probar el diseño sin copiar todavía todos los binarios, las imágenes y el vídeo se cargan temporalmente desde la web Next.js actual `https://d-solution.org`.

Antes de mover el dominio principal `d-solution.org` a Odoo, esos archivos deben copiarse al propio módulo o a Odoo para eliminar esa dependencia temporal.

## Rutas conservadas

- `/servicios`
- `/servicios/tecnologia-audiovisual`
- `/servicios/marketing-digital`
- `/servicios/desarrollo-web`
- `/servicios/automatizacion-ia`
- `/servicios/branding-diseno`
- `/servicios/fotografia-profesional`

Esto evita cambiar innecesariamente URLs ya existentes.

## Instalación en el VPS

1. Descomprimir la carpeta `website_dsolution` dentro de `/mnt/extra-addons/`.
2. Volver a añadir `/mnt/extra-addons` al `addons_path` de Odoo.
3. Reiniciar/redeploy de Odoo.
4. En Odoo: Apps -> Actualizar lista de aplicaciones.
5. Buscar `D-Solution Website` e instalar.
6. Probar el formulario y confirmar que crea una oportunidad en CRM.

## Pendiente para siguientes versiones

- Sustituir recursos remotos por archivos locales/Odoo Media.
- Activar ES/EN con el sistema multidioma nativo de Odoo.
- Convertir portafolio en contenido dinámico administrado desde Odoo.
- Mejorar cada página de servicio con el contenido completo actual.
- Integrar ventas/proyectos/facturación.
- Evaluar OCA AI/MCP y el MCP oficial cuando esté disponible en Community.
- Chatwoot/WhatsApp se tratarán en una fase separada.

## Nota de desarrollo

Esta versión fue construida contra la estructura documentada oficialmente para temas de Odoo `master`: módulo con `__manifest__.py`, QWeb/XML, SCSS y JavaScript dentro de `web.assets_frontend`.


## v0.2
- Corrige definición de paleta SCSS para Odoo master.
- Corrige expresiones CSS `min()` incompatibles con libsass.
- Elimina referencias a `website.default_website` de páginas personalizadas.


## v0.3
- El estilo visual principal pasa de SCSS a CSS puro para evitar que libsass intente interpretar funciones CSS modernas (`min()`, `clamp()`, variables CSS).
- La paleta SCSS personalizada queda temporalmente fuera del bundle; el diseño sigue usando sus variables CSS propias.
- Corrige la ubicación de `no_header` y `no_footer` para evitar duplicar la cabecera y pie de Odoo en las páginas D-Solution.


## v0.4
- Corrige la Home para ocultar correctamente la cabecera y pie estándar de Odoo antes de llamar a `website.layout`.


## v0.5
- Todos los recursos visuales del frontend apuntan ahora a rutas locales del módulo Odoo.
- Añade script de sincronización para copiar una sola vez los recursos actuales desde el repo `dsolution-web` al módulo Odoo.
- Ajustes visuales y responsive para desktop, tablet y móvil.
- El Hero mantiene el vídeo actual, pero con tratamiento visual más oscuro para disimular artefactos de compresión. La calidad máxima sigue limitada por el archivo de vídeo original.


## v0.6
- El Hero ya no usa vídeo: se recrea con SVG + CSS animado, por lo que no se pixela y escala con nitidez en móvil, tablet, 1080p y 4K.
- Mantiene las imágenes reales de servicios como archivos locales del módulo Odoo mediante el sincronizador.
- Añade botón flotante de WhatsApp.
- Mejora el header en móvil: cambia correctamente a fondo claro al abrir el menú, cierra con Escape y se reajusta al cambiar el tamaño.
- Mejora CTA, microinteracciones, indicador de scroll y responsive del Hero.
- El selector ES/EN sigue siendo visual por ahora; la siguiente fase debe conectarse a traducciones nativas de Odoo.

## v0.7
- Reemplaza el WhatsApp dibujado por el icono original de la web D-Solution.
- Añade un grupo **D-Solution** dentro de `Sitio web > Editar > Bloques`.
- Añade bloques reutilizables para Hero, contenido, imagen y CTA.
- Marca las secciones principales de la Home con `data-name` y `data-snippet` para mejorar compatibilidad con Website Builder.
- Las imágenes de bloques estándar pueden seleccionarse y reemplazarse desde el editor de Odoo.
- El fondo vectorial animado del Hero sigue controlado por código; el texto y los bloques de contenido pasan a ser más editables.
- Header, navegación, destinos de servicios y lógica avanzada siguen controlados por el módulo para evitar romper el diseño.

## v0.8
- Corrige el problema visual de Deshacer/Rehacer en el editor de Odoo.
- Elimina identificadores `data-snippet` de secciones que no tenían una plantilla completa asociada.
- Mantiene el Hero como bloque Odoo real, ya que ese bloque sí funciona correctamente.
- Mantiene el formulario nativo `s_website_form` sin cambios.
- No cambia el diseño visual de la web: esta versión es principalmente de estabilidad del editor.

## v0.9
- Sustituye las cuatro imágenes provisionales de **Proceso** por las fotografías reales usadas actualmente en `d-solution.org`.
- Las cuatro fotografías se copian al propio Odoo durante la sincronización; si Directus no responde, se mantiene un fallback local y la web no queda rota.
- Añade `o_we_custom_image` a imágenes de Proceso, Portfolio, Servicios y al bloque D-Solution Imagen para que el selector de medios de Odoo pueda reemplazarlas.
- Añade **D-Solution Video** en `Sitio web > Editar > Bloques > D-Solution`, reutilizando el bloque de vídeo nativo de Odoo.
- El vídeo no se inserta automáticamente en la Home porque la Home pública actual no contiene un segundo vídeo separado del Hero; el bloque queda disponible para añadirlo donde quieras.
- Cuando sustituyes una imagen desde el editor, Odoo puede guardar la nueva imagen en su sistema de medios/adjuntos.

## v0.10
- Convierte **Servicios**, **Proceso** y **Portafolio** de la Home en snippets completos de Odoo (no plantillas vacías).
- En modo edición, las imágenes de Proceso y Servicios se muestran temporalmente separadas del texto/overlay para poder seleccionarlas fácilmente.
- Añade etiquetas visuales `Imagen editable` solo mientras editas.
- Evita que las tarjetas de servicios/portfolio naveguen al hacer clic durante la edición.
- Mantiene el diseño original cuando sales del editor.
- Añade un nuevo bloque **D-Solution Galería** con 3 imágenes reemplazables desde Odoo.
- El bloque **D-Solution Video** de v0.9 sigue disponible.
- La imagen principal de la página general `/servicios` también queda preparada para el selector de medios.


## v0.11
- Reestructura las 6 páginas de servicios para que títulos, textos y puntos estén directamente en cada página y puedan editarse desde Website Builder.
- Cada servicio tiene imagen Hero individual reemplazable desde Odoo.
- Añade una galería de 3 imágenes editables por servicio.
- Mantiene formulario CRM y footer.
- Añade meta title y meta description únicos por servicio usando `website.layout`.
- Conserva las URLs actuales.

## v0.12
- Reconstruye el **Hero de la Home** según la web original: vídeo a pantalla completa, overlay oscuro y título de dos líneas.
- El vídeo usado es `public/hero-dsolution-loop.mp4` del repositorio original `dsolution-web`; el script de sincronización lo copia automáticamente a Odoo.
- Ya no hace falta subir manualmente ese MP4 al VPS.
- Sustituye el selector ES/EN decorativo por el **selector de idioma nativo de Odoo** (`website.language_selector_inline`).
- Si el sitio solo tiene un idioma activo, se mantiene un fallback ES/EN visual; al activar English en Odoo aparece automáticamente el selector real.
- Añade traducciones EN iniciales para los principales textos de Home/header/contact.
- Mantiene todos los bloques editables y el formulario CRM.

## v0.12.1 hotfix
- Corrige el RPC_ERROR al actualizar el módulo en Odoo master/19.5.
- Elimina temporalmente el `i18n/en_US.po` manual inválido para el importador actual de Odoo.
- El selector ES/EN nativo sigue funcionando si English está activado en el sitio.
- Las traducciones se gestionarán mediante el sistema nativo de Odoo y después se podrá exportar un PO válido.
- No cambia el Hero de vídeo ni el diseño de la Home.

## v0.13
- El Hero deja de depender del MP4 de respaldo del repositorio original.
- Añade en **Sitio web > Configuración > Ajustes > D-Solution** un campo normal de Odoo para subir/reemplazar el MP4 del Hero.
- El archivo se guarda mediante un campo `Binary(attachment=True)` de Odoo, es decir, en su sistema de archivos/adjuntos persistente.
- Añade también una imagen Hero/poster editable desde Ajustes.
- Orden de prioridad: vídeo MP4 subido > imagen Hero > animación vectorial de respaldo.
- Las demás imágenes del sitio siguen siendo reemplazables desde Website Builder.
- El selector ES/EN deja de ser decorativo: usa `frontend_languages` + `url_localized`, el mismo mecanismo de URL de idioma que usa el selector oficial de Odoo.
- No incluye un `.po` manual. Las traducciones se harán con el flujo nativo de traducción de Odoo.

## v0.14
- Corrige el icono de **Servicios**: elimina el carácter `⌄` flotante y usa un chevron SVG limpio, alineado y con giro al abrir el menú.
- Ajusta el header para portátiles y tablets; a partir de 1100 px hacia abajo usa el menú móvil para evitar elementos comprimidos.
- Mejora el comportamiento responsive del Hero con vídeo en tablet y móvil.
- Revisa grids de Proceso, Portfolio, estadísticas, formulario/contacto y footer en tablet/móvil.
- Ajusta tamaños del logo, menú móvil y WhatsApp en pantallas estrechas.
- Mantiene el sistema de vídeo Hero gestionado por Odoo y el selector ES/EN funcional.
- No añade traducciones inglesas todavía; se harán cuando el diseño quede estable.

## v0.15
- Replica la intro de carga del sitio original: logo D-Solution, línea dorada animada y tagline.
- La intro se muestra una sola vez por sesión del navegador, igual que el código original (`sessionStorage`, 1650 ms).
- Rediseña únicamente `/servicios/marketing-digital` siguiendo la captura y el código original.
- Hero oscuro con imagen grande, CTA y panel de 4 servicios.
- Añade “Qué incluye nuestro servicio” y “¿Para quién es?”.
- La imagen Hero y las 3 fotos de “¿Para quién es?” son reemplazables desde Website Builder.
- Responsive específico para Marketing en tablet y móvil.
- No añade campos Python ni modifica la base de datos: actualización normal.

## v0.16
- Marketing Digital: cambia el fondo Hero por una imagen local más fotográfica/orientada a laptop como base visual.
- La imagen Hero sigue siendo **editable desde Website Builder**.
- Sustituye los iconos de texto de “Servicios que ofrecemos” por marcas vectoriales reconocibles para:
  - Google Ads
  - Meta Ads
  - Google Analytics
  - Google Tag Manager
- Los 4 logos son archivos SVG locales dentro del addon; no dependen de CDNs externos.
- Cada logo usa `o_we_custom_image`, por lo que puede reemplazarse desde el editor de Odoo.
- En modo edición, los logos muestran una guía “Logo editable”.
- No añade Python ni modifica la base de datos: actualización normal.

## v0.17 — Editor avanzado D-Solution
- Añade opciones personalizadas al **Website Builder nativo de Odoo 19** usando `BaseOptionComponent`, `Plugin`, `registry("website-plugins")` y `website.website_builder_assets`.
- No modifica el core de Odoo.
- Para textos D-Solution:
  - espaciado entre letras
  - altura de línea
  - peso
  - mayúsculas/minúsculas
  - alineación
  - ancho máximo
  - colores rápidos de marca
  - opacidad
- Para botones/tarjetas/paneles:
  - radio de esquinas
  - sombra
  - opacidad
- Para imágenes editables:
  - radio de esquinas
  - cover/contain
  - posición
  - sombra
  - opacidad
- Para logos de Marketing:
  - tamaño 40 / 48 / 56 / 64 px
- Es una actualización **normal**: no añade campos Python ni modifica la base de datos.

## v0.17.1 — corrección del editor avanzado
- Corrige el enlace de las opciones con el comportamiento real del Website Builder de Odoo 19.
- Usa el patrón oficial `selector` + `applyTo`.
- Cuando la sección `Marketing Digital Hero` está seleccionada, el panel Estilo debe mostrar controles para el título, descripción, botón e imagen.
- No modifica Python ni base de datos.

## v0.18 — rendimiento del Hero
- Corrige el cuello de botella detectado en producción: el MP4 del Hero ya no se sirve mediante `/web/content/...`.
- Añade `Hero video URL` por sitio web para usar una URL HTTPS pública directa a un MP4 servido por CDN/object storage.
- El antiguo campo Binary se conserva en el modelo únicamente por compatibilidad, pero deja de utilizarse en el Hero público.
- El vídeo usa `preload="none"` y se solicita después de la carga crítica de la página mediante `requestIdleCallback`/fallback.
- La imagen Hero funciona como `poster`, por lo que el visitante ve contenido inmediatamente mientras el vídeo comienza.
- Si no hay URL de vídeo, se usa la imagen Hero; si tampoco hay imagen, se mantiene el fondo vectorial.
- Añade un fallback para que las secciones `.ds-reveal` nunca queden invisibles si el JavaScript frontend no llega a ejecutarse.
- Esta versión añade un nuevo campo Python (`dsolution_hero_video_url`) al modelo `website`, por lo que es una **actualización estructural**.

## v0.18.1 — hotfix de compatibilidad del editor
- Desactiva temporalmente el bundle personalizado `website.website_builder_assets` de D-Solution.
- Corrige el error de cliente `Class extends value undefined is not a constructor or null`
  que aparece al abrir el Website Builder en la build Odoo 19.5a1-20260910.
- Mantiene intactos el Hero optimizado, el campo `Hero video URL`, el diseño y el frontend público.
- Las opciones avanzadas D-Solution (espaciado de letras, etc.) quedan temporalmente desactivadas
  hasta adaptarlas a la API exacta de la build instalada.
- No modifica modelos ni base de datos respecto a v0.18: actualización normal.

## v0.19.1 — corrección completa de los cambios visuales

Esta versión rehace los cambios de v0.19 mediante vistas heredadas separadas para
que se apliquen explícitamente sobre los templates actuales de D-Solution.

Cambios verificables:
- Estadísticas: Rocket, Folder, Globe y BarChart dorados como medios Odoo.
- Ecosistema: los antiguos cuadrados con letras pasan a ser espacios reales para logos;
  el texto sigue a la derecha. Los logos fuente son imágenes Odoo reemplazables.
- Contacto: iconos PNG dorados para email, WhatsApp y ubicación, registrados como medios Odoo.
- Contacto: nuevo bloque nativo `s_hr` sin línea, usado como espacio superior editable.
- Hero: vuelve el campo para subir MP4 directamente; la URL/CDN sigue teniendo prioridad.
  El vídeo no lleva `src` en el HTML inicial: el poster y el contenido cargan primero.
- No se reactiva el editor JS experimental de v0.17 que causó errores de compatibilidad.

La documentación oficial de Odoo recomienda registrar imágenes como `ir.attachment`
para que estén disponibles y funcionen mejor dentro del Website Builder.

## v0.19.2 — compatibilidad Odoo 20.1 alpha

- Cambia la serie del manifest de `19.5` a `20.1`.
- Mantiene todos los cambios funcionales de v0.19.1:
  - iconos dorados de estadísticas;
  - espacios editables para logos en Ecosistema;
  - iconos editables de Contacto;
  - espacio superior editable del bloque Contacto;
  - Hero con subida MP4 directa y URL/CDN opcional;
  - carga diferida del vídeo.
- No toca el core de Odoo.
- No añade nuevos campos respecto a v0.19.1.
- Preparada para el servidor detectado: Odoo 20.1a1.
