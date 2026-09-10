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
