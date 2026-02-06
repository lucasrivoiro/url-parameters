#!/bin/bash

ICONS_SRC="/Users/lucasrivoiro/Projetos/pessoais/safari/url-parameters/icons"
ICONS_DST="/Users/lucasrivoiro/Projetos/pessoais/safari/URL Parameters/Shared (App)/Assets.xcassets/AppIcon.appiconset"
RESOURCES_DST="/Users/lucasrivoiro/Projetos/pessoais/safari/URL Parameters/Shared (App)/Resources"

# Copy toolbar icon
cp "$ICONS_SRC/icon-128.png" "$RESOURCES_DST/Icon.png"

# Copy app icons (these are for the app itself, not the toolbar)
cp "$ICONS_SRC/icon-16.png" "$ICONS_DST/mac-icon-16@1x.png"
cp "$ICONS_SRC/icon-32.png" "$ICONS_DST/mac-icon-16@2x.png"
cp "$ICONS_SRC/icon-32.png" "$ICONS_DST/mac-icon-32@1x.png"
sips -z 64 64 "$ICONS_SRC/icon-128.png" --out "$ICONS_DST/mac-icon-32@2x.png"
cp "$ICONS_SRC/icon-128.png" "$ICONS_DST/mac-icon-128@1x.png"
cp "$ICONS_SRC/icon-256.png" "$ICONS_DST/mac-icon-128@2x.png"
cp "$ICONS_SRC/icon-256.png" "$ICONS_DST/mac-icon-256@1x.png"
cp "$ICONS_SRC/icon-512.png" "$ICONS_DST/mac-icon-256@2x.png"
cp "$ICONS_SRC/icon-512.png" "$ICONS_DST/mac-icon-512@1x.png"
sips -z 1024 1024 "$ICONS_SRC/icon-512.png" --out "$ICONS_DST/mac-icon-512@2x.png"
sips -z 1024 1024 "$ICONS_SRC/icon-512.png" --out "$ICONS_DST/universal-icon-1024@1x.png"

echo "App icons updated!"
