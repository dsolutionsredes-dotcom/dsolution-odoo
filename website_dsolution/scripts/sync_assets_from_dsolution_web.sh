#!/bin/sh
set -eu

TMP="/tmp/dsolution-web-assets"
MOD="/mnt/extra-addons/website_dsolution"
IMG="$MOD/static/src/img/content"

rm -rf "$TMP"
mkdir -p "$TMP" "$IMG"

curl -fsSL https://github.com/dsolutionsredes-dotcom/dsolution-web/archive/refs/heads/main.tar.gz \
  | tar -xz -C "$TMP" --strip-components=1

for f in \
  ds-logo-mark-dark.png \
  ds-logo-mark-light.png \
  seo-image.jpg \
  service-audiovisual.jpg \
  service-marketing.jpg \
  service-web.jpg \
  service-automation.jpg \
  service-branding.jpg \
  service-photography.jpg \
  whatsapp-icon.png
do
  cp "$TMP/public/$f" "$IMG/$f"
done



# Fotografías reales usadas actualmente en la sección Proceso de d-solution.org.
# Primero dejamos fallback local para que nunca queden imágenes rotas.
cp "$IMG/service-branding.jpg" "$IMG/process-01-entendemos.jpg"
cp "$IMG/service-marketing.jpg" "$IMG/process-02-estrategia.jpg"
cp "$IMG/service-audiovisual.jpg" "$IMG/process-03-creamos.jpg"
cp "$IMG/service-web.jpg" "$IMG/process-04-medimos.jpg"

fetch_process_image() {
  URL="$1"
  DEST="$2"
  TMPFILE="${DEST}.tmp"
  if curl -fsSL "$URL" -o "$TMPFILE"; then
    mv "$TMPFILE" "$DEST"
  else
    rm -f "$TMPFILE"
    echo "AVISO: no se pudo actualizar $(basename "$DEST"); se mantiene el fallback local."
  fi
}

fetch_process_image "https://admin.d-solution.org/assets/a630fed2-0406-428d-8e7d-447b229b96c1" "$IMG/process-01-entendemos.jpg"
fetch_process_image "https://admin.d-solution.org/assets/67eb4c18-1300-421f-a98b-80cafbe95ea5" "$IMG/process-02-estrategia.jpg"
fetch_process_image "https://admin.d-solution.org/assets/8c0f6570-c512-43ca-a32c-f84400fe4231" "$IMG/process-03-creamos.jpg"
fetch_process_image "https://admin.d-solution.org/assets/99126a16-4d41-443d-9ed4-12b0b8687813" "$IMG/process-04-medimos.jpg"

echo "FOTOS REALES DE PROCESO PREPARADAS"

echo "IMAGENES D-SOLUTION COPIADAS EN ODOO"
