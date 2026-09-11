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


echo "IMAGENES D-SOLUTION COPIADAS EN ODOO"
