#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_NAME="real-estate-app"
VERSION="$(node -p "require('${ROOT_DIR}/package.json').version")"
OUTPUT_DIR="${ROOT_DIR}/dist"
ZIP_NAME="${PACKAGE_NAME}-themeforest-v${VERSION}.zip"
ZIP_PATH="${OUTPUT_DIR}/${ZIP_NAME}"

echo "==> Real Estate App — ThemeForest packager"
echo "    Package folder: ${PACKAGE_NAME}"
echo "    Version: ${VERSION}"
echo ""

cd "$ROOT_DIR"

echo "==> Step 1/4: Verify production build..."
rm -rf .next
export NEXTAUTH_SECRET="build-time-placeholder-secret-minimum-32-chars"
export NEXTAUTH_URL="http://localhost:3000"
export NEXT_PUBLIC_SITE_URL="http://localhost:3000"
npm run build
echo "    Build OK"
echo ""

echo "==> Step 2/4: Stage files for packaging..."
STAGING_DIR="$(mktemp -d)"
trap 'rm -rf "$STAGING_DIR"' EXIT

rsync -a \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude .env.local \
  --exclude .env \
  --exclude dist \
  --exclude .DS_Store \
  --exclude realestate-website \
  "$ROOT_DIR/" "$STAGING_DIR/$PACKAGE_NAME/"

echo "    Staged to ${STAGING_DIR}/${PACKAGE_NAME}"
echo ""

echo "==> Step 3/4: Create output directory..."
mkdir -p "$OUTPUT_DIR"
rm -f "$ZIP_PATH"
echo ""

echo "==> Step 4/4: Create ZIP (source only, no secrets/caches)..."
(cd "$STAGING_DIR" && zip -r "$ZIP_PATH" "$PACKAGE_NAME" > /dev/null)

echo ""
echo "==> Done!"
echo "    Upload this file to ThemeForest as your Main File:"
echo "    ${ZIP_PATH}"
echo ""
echo "    Also prepare separately:"
echo "    - Live demo URL"
echo "    - 6+ screenshots (desktop + mobile)"
echo "    - Thumbnail 80x80, preview 590x300"
echo ""
