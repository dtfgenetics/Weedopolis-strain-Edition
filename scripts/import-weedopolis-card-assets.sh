#!/usr/bin/env bash
set -euo pipefail

# Import the generated Weedopolis digital card asset package into the repo.
# Usage from repo root:
#   bash scripts/import-weedopolis-card-assets.sh /path/to/Weedopolis_Digital_Game_Assets_v1.zip

ZIP_PATH="${1:-}"
TARGET_DIR="public/assets/weedopolis/cards"

if [[ -z "$ZIP_PATH" || ! -f "$ZIP_PATH" ]]; then
  echo "Usage: bash scripts/import-weedopolis-card-assets.sh /path/to/Weedopolis_Digital_Game_Assets_v1.zip" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

unzip -q "$ZIP_PATH" -d "$TMP_DIR"
SRC_DIR="$TMP_DIR/Weedopolis_Digital_Game_Assets_v1"

if [[ ! -d "$SRC_DIR" ]]; then
  echo "Could not find Weedopolis_Digital_Game_Assets_v1 inside zip." >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
rsync -a --delete "$SRC_DIR/" "$TARGET_DIR/"

echo "Imported Weedopolis card assets into $TARGET_DIR"
echo "Next: git add $TARGET_DIR && git commit -m 'Add Weedopolis digital card images'"
