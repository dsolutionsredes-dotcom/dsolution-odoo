#!/bin/sh
set -eu

TMP="/tmp/dsolution-web-assets"
MOD="/mnt/extra-addons/website_dsolution"
IMG="$MOD/static/src/img/content"
MEDIA="$MOD/static/src/media"

rm -rf "$TMP"
mkdir -p "$TMP" "$IMG" "$MEDIA"

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
  service-photography.jpg
do
  cp "$TMP/public/$f" "$IMG/$f"
done

cp "$TMP/public/hero-dsolution-loop.mp4" "$MEDIA/hero-dsolution-loop.mp4"

echo "ASSETS D-SOLUTION COPIADOS EN ODOO"
