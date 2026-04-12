#!/bin/bash

echo "========================================="
echo "  PRE-PUBLISH VALIDATION"
echo "========================================="
echo ""

if [[ -n $(git status -s) && "$1" != "--force" ]]; then
  echo "❌ ERROR: Uncommitted changes detected."
  git status -s
  echo ""
  echo "📌 This script will temporarily modify package.json files and publish to npm."
  echo "   After publishing, it will revert those changes automatically."
  echo ""
  echo "   You have two options:"
  echo ""
  echo "   1) Commit your changes:"
  echo "        git add . && git commit -m \"WIP\""
  echo ""
  echo "   2) Stash your changes (temporary):"
  echo "        git stash push -m \"pre-publish\""
  echo "        (After publish, run: git stash pop)"
  echo ""
  echo "   Choose one before running this script."
  exit 1
fi

echo "✅ Working directory is clean"
echo ""

echo "========================================="
echo "  RENAMING FOR PUBLISH"
echo "========================================="
echo ""

ROOT_CHANGES=$(grep -c "@react-financial-charts" package.json)
echo "Root package.json: $ROOT_CHANGES changes"
sed -i '' 's|"name": "react-financial-charts"|"name": "@sgonzaloc/react-financial-charts"|g' package.json
sed -i '' 's|@react-financial-charts|@sgonzaloc/react-financial-charts|g' package.json
sed -i '' "s|--workspace='react-financial-charts'|--workspace='@sgonzaloc/react-financial-charts'|g" package.json
sed -i '' 's|--workspace='\''@sgonzaloc/react-financial-charts/|--workspace='\''@sgonzaloc/react-financial-charts-|g' package.json
sed -i '' 's|--workspace=@sgonzaloc/react-financial-charts/|--workspace=@sgonzaloc/react-financial-charts-|g' package.json
sed -i '' 's|"@sgonzaloc/react-financial-charts/|"@sgonzaloc/react-financial-charts-|g' package.json
sed -i '' '/"dependencies": {/,/}/s|"@sgonzaloc/react-financial-charts/|"@sgonzaloc/react-financial-charts-|g' package.json

echo ""
echo "Packages:"
TOTAL_PKG=0
for pkg in packages/*/package.json; do
  PKG_NAME=$(basename $(dirname "$pkg"))
  CHANGES=$(grep -c "@react-financial-charts" "$pkg" 2>/dev/null || echo "0")
  if [ "$CHANGES" -gt 0 ]; then
    echo "  $PKG_NAME: $CHANGES changes"
    sed -i '' 's|"@react-financial-charts/|"@sgonzaloc/react-financial-charts-|g' "$pkg"
    sed -i '' 's|"name": "react-financial-charts"|"name": "@sgonzaloc/react-financial-charts"|g' "$pkg"
    sed -i '' 's|"@sgonzaloc/react-financial-charts/|"@sgonzaloc/react-financial-charts-|g' "$pkg"
    TOTAL_PKG=$((TOTAL_PKG + CHANGES))
  else
    echo "  $PKG_NAME: 0 changes"
  fi
done
echo "  Total packages changes: $TOTAL_PKG"

echo ""
echo "Source files (.ts, .tsx):"
SRC_CHANGES=$(grep -r "@react-financial-charts/" packages --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
echo "  $SRC_CHANGES changes"
find packages -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@react-financial-charts/|@sgonzaloc/react-financial-charts-|g' 2>/dev/null

echo ""
echo "========================================="
echo "  TOTAL CHANGES: $((ROOT_CHANGES + TOTAL_PKG + SRC_CHANGES))"
echo "========================================="


CHANGES=$(grep -l '"file:\.\./' packages/*/package.json | wc -l | tr -d ' ')
echo "📦 Files with file: dependencies: $CHANGES"
sed -i '' 's|"file:\.\./[^"]*"|"^3.0.0"|g' packages/*/package.json
echo "✅ Replaced in $CHANGES package.json files"


echo ""
echo "Next steps:"
echo "   npm i"
echo "   npm run build"
echo "   npm run publish -- --access public"
echo "   git checkout -- packages/*/package.json package.json"
