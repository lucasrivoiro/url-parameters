#!/bin/bash

# Script to generate PNG icons from SVG
# Requires: rsvg-convert (from librsvg) or ImageMagick

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

generate_icons() {
    local svg_file=$1
    local suffix=$2
    
    if command -v rsvg-convert &> /dev/null; then
        echo "Using rsvg-convert for $svg_file..."
        rsvg-convert -w 16 -h 16 "$svg_file" -o "icon-16${suffix}.png"
        rsvg-convert -w 32 -h 32 "$svg_file" -o "icon-32${suffix}.png"
        rsvg-convert -w 48 -h 48 "$svg_file" -o "icon-48${suffix}.png"
        rsvg-convert -w 96 -h 96 "$svg_file" -o "icon-96${suffix}.png"
        rsvg-convert -w 128 -h 128 "$svg_file" -o "icon-128${suffix}.png"
        rsvg-convert -w 256 -h 256 "$svg_file" -o "icon-256${suffix}.png"
        rsvg-convert -w 512 -h 512 "$svg_file" -o "icon-512${suffix}.png"
    elif command -v convert &> /dev/null; then
        echo "Using ImageMagick for $svg_file..."
        convert -background none -resize 16x16 "$svg_file" "icon-16${suffix}.png"
        convert -background none -resize 32x32 "$svg_file" "icon-32${suffix}.png"
        convert -background none -resize 48x48 "$svg_file" "icon-48${suffix}.png"
        convert -background none -resize 96x96 "$svg_file" "icon-96${suffix}.png"
        convert -background none -resize 128x128 "$svg_file" "icon-128${suffix}.png"
        convert -background none -resize 256x256 "$svg_file" "icon-256${suffix}.png"
        convert -background none -resize 512x512 "$svg_file" "icon-512${suffix}.png"
    elif command -v qlmanage &> /dev/null; then
        echo "Using qlmanage (macOS) for $svg_file..."
        qlmanage -t -s 512 -o . "$svg_file" 2>/dev/null
        local base_name=$(basename "$svg_file" .svg)
        if [ -f "${base_name}.svg.png" ]; then
            mv "${base_name}.svg.png" "icon-512${suffix}.png"
            sips -z 256 256 "icon-512${suffix}.png" --out "icon-256${suffix}.png"
            sips -z 128 128 "icon-512${suffix}.png" --out "icon-128${suffix}.png"
            sips -z 96 96 "icon-512${suffix}.png" --out "icon-96${suffix}.png"
            sips -z 48 48 "icon-512${suffix}.png" --out "icon-48${suffix}.png"
            sips -z 32 32 "icon-512${suffix}.png" --out "icon-32${suffix}.png"
            sips -z 16 16 "icon-512${suffix}.png" --out "icon-16${suffix}.png"
        else
            echo "Failed to generate icons from $svg_file"
            return 1
        fi
    else
        echo "No suitable tool found. Please install librsvg:"
        echo "  brew install librsvg"
        return 1
    fi
}

# Generate light mode icons
generate_icons "icon.svg" ""
echo "Light mode icons generated!"

# Generate dark mode icons
if [ -f "icon-dark.svg" ]; then
    generate_icons "icon-dark.svg" "-dark"
    echo "Dark mode icons generated!"
fi

echo "All icons generated successfully!"
