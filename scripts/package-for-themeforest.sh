#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_NAME="real-estate-app"
VERSION="$(node -p "require('${ROOT_DIR}/package.json').version")"
OUTPUT_DIR="${ROOT_DIR}/dist"
MAIN_ZIP="${OUTPUT_DIR}/${PACKAGE_NAME}-main-v${VERSION}.zip"
DOC_ZIP="${OUTPUT_DIR}/${PACKAGE_NAME}-documentation-v${VERSION}.zip"
# Legacy alias for ThemeForest naming
LEGACY_ZIP="${OUTPUT_DIR}/${PACKAGE_NAME}-themeforest-v${VERSION}.zip"

echo "==> Real Estate App — CodeCanyon / Envato packager"
echo "    Package folder: ${PACKAGE_NAME}"
echo "    Version: ${VERSION}"
echo ""

cd "$ROOT_DIR"

echo "==> Step 1/5: Verify production build..."
rm -rf .next
export NEXTAUTH_SECRET="build-time-placeholder-secret-minimum-32-chars"
export NEXTAUTH_URL="http://localhost:3000"
export NEXT_PUBLIC_SITE_URL="http://localhost:3000"
export VERCEL_URL="localhost:3000"
npm run build
echo "    Build OK"
echo ""

echo "==> Step 2/5: Stage main application files..."
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

echo "==> Step 3/5: Create output directory..."
mkdir -p "$OUTPUT_DIR"
rm -f "$MAIN_ZIP" "$DOC_ZIP" "$LEGACY_ZIP"
echo ""

echo "==> Step 4/5: Create main application ZIP..."
(cd "$STAGING_DIR" && zip -r "$MAIN_ZIP" "$PACKAGE_NAME" > /dev/null)
# Same file, legacy filename for existing docs
cp "$MAIN_ZIP" "$LEGACY_ZIP"
echo "    Main file: ${MAIN_ZIP}"
echo ""

echo "==> Step 5/5: Create documentation ZIP (optional Envato upload)..."
DOC_STAGE="$(mktemp -d)"
mkdir -p "$DOC_STAGE/documentation"
cp "$ROOT_DIR/documentation/index.html" "$DOC_STAGE/documentation/"
cp "$ROOT_DIR/install.txt" "$DOC_STAGE/"
cp "$ROOT_DIR/README.md" "$DOC_STAGE/"
cp "$ROOT_DIR/CHANGELOG.md" "$DOC_STAGE/"
cp "$ROOT_DIR/LICENSE.txt" "$DOC_STAGE/"
cp "$ROOT_DIR/CODECANYON_REVIEWER_NOTES.txt" "$DOC_STAGE/"
(cd "$DOC_STAGE" && zip -r "$DOC_ZIP" . > /dev/null)
echo "    Documentation: ${DOC_ZIP}"
echo ""

echo "==> Done!"
echo ""
echo "  CODECANYON UPLOAD — use these files:"
echo "  ┌─────────────────────────────────────────────────────────────┐"
echo "  │ Main File(s):     ${MAIN_ZIP}"
echo "  │ Documentation:    ${DOC_ZIP}  (if separate slot available)"
echo "  │ Live Preview URL: your Vercel demo URL"
echo "  └─────────────────────────────────────────────────────────────┘"
echo ""
echo "  Category: CodeCanyon → JavaScript → Full Applications"
echo ""
echo "  Also prepare: thumbnail 80x80, preview 590x300, 6+ screenshots"
echo ""
