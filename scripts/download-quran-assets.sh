#!/usr/bin/env bash
set -euo pipefail

# Download Quran data assets (surah/ayah text and translations) using curl.
#
# This script targets the public Al-Quran Cloud API (https://alquran.cloud).
# It saves JSON files into the specified output directory, so you can bundle them
# with the app or use them for offline data.
#
# Usage:
#   ./scripts/download-quran-assets.sh
#   OUTPUT_DIR=public/quran ./scripts/download-quran-assets.sh
#
# Notes:
# - The API provides full Quran payloads (all surahs+ayahs) by edition.
# - Tafsir/tafsir is not available via this API (as of today) so that part is
#   left as a placeholder for adding your own source.

OUTPUT_DIR="${OUTPUT_DIR:-public/quran}"
mkdir -p "$OUTPUT_DIR"

echo "Downloading full Quran (Uthmani) to $OUTPUT_DIR/quran-uthmani.json..."
curl -sS -L "https://api.alquran.cloud/v1/quran/quran-uthmani" -o "$OUTPUT_DIR/quran-uthmani.json"

declare -A TRANSLATIONS=(
  [en]=en.asad
  [fr]=fr.hamidullah
  [es]=es.cortes
  [ur]=ur.jalandhry
  [tr]=tr.diyanet
  [id]=id.indonesian
)

for lang in "${!TRANSLATIONS[@]}"; do
  edition="${TRANSLATIONS[$lang]}"
  out="$OUTPUT_DIR/quran-${lang}.json"
  echo "Downloading translation [$lang] ($edition) to $out..."
  curl -sS -L "https://api.alquran.cloud/v1/quran/${edition}" -o "$out"
done

cat <<'EOF'
✅ Done.

Downloaded:
  - Full Arabic Quran:  public/quran/quran-uthmani.json
  - Translations:       public/quran/quran-<lang>.json

Next steps (optional):
  - Add tafsir sources and download them (not provided via alquran.cloud).
  - Update the app to load these JSON files from /public/quran/ instead of calling the API.
EOF
