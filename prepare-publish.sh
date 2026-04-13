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
echo "  CLEANING NODE_MODULES"
echo "========================================="
echo ""

rm -rf node_modules packages/*/node_modules package-lock.json
echo "✅ Cleaned node_modules and package-lock.json"

echo "========================================="
echo "  RENAMING FOR PUBLISH"
echo "========================================="
echo ""

# Count changes in root package.json
ROOT_CHANGES=$(grep -c "@react-financial-charts" package.json)
echo "Root package.json: $ROOT_CHANGES changes"

# Change package name from react-financial-charts to @sgonzaloc/react-financial-charts
sed -i '' 's|"name": "react-financial-charts"|"name": "@sgonzaloc/react-financial-charts"|g' package.json

# Replace all @react-financial-charts with @sgonzaloc/react-financial-charts
sed -i '' 's|@react-financial-charts|@sgonzaloc/react-financial-charts|g' package.json

# Fix workspace name: --workspace='react-financial-charts' to --workspace='@sgonzaloc/react-financial-charts'
sed -i '' "s|--workspace='react-financial-charts'|--workspace='@sgonzaloc/react-financial-charts'|g" package.json

# Fix workspace with slash: --workspace='@sgonzaloc/react-financial-charts/xxx' to --workspace='@sgonzaloc/react-financial-charts-xxx'
sed -i '' 's|--workspace='\''@sgonzaloc/react-financial-charts/|--workspace='\''@sgonzaloc/react-financial-charts-|g' package.json

# Fix workspace without quotes: --workspace=@sgonzaloc/react-financial-charts/xxx to --workspace=@sgonzaloc/react-financial-charts-xxx
sed -i '' 's|--workspace=@sgonzaloc/react-financial-charts/|--workspace=@sgonzaloc/react-financial-charts-|g' package.json

# Replace slash with dash in package names: "@sgonzaloc/react-financial-charts/xxx" to "@sgonzaloc/react-financial-charts-xxx"
sed -i '' 's|"@sgonzaloc/react-financial-charts/|"@sgonzaloc/react-financial-charts-|g' package.json

# Replace slash with dash in dependencies section only
sed -i '' '/"dependencies": {/,/}/s|"@sgonzaloc/react-financial-charts/|"@sgonzaloc/react-financial-charts-|g' package.json

echo ""
echo "Packages:"
TOTAL_PKG=0
for pkg in packages/*/package.json; do
  PKG_NAME=$(basename $(dirname "$pkg"))
  # Count how many @react-financial-charts occurrences in this package.json
  CHANGES=$(grep -c "@react-financial-charts" "$pkg" 2>/dev/null || echo "0")
  if [ "$CHANGES" -gt 0 ]; then
    echo "  $PKG_NAME: $CHANGES changes"
    # Replace @react-financial-charts/xxx with @sgonzaloc/react-financial-charts-xxx
    sed -i '' 's|"@react-financial-charts/|"@sgonzaloc/react-financial-charts-|g' "$pkg"
    # Replace package name from react-financial-charts to @sgonzaloc/react-financial-charts
    sed -i '' 's|"name": "react-financial-charts"|"name": "@sgonzaloc/react-financial-charts"|g' "$pkg"
    # Replace any remaining slash with dash (cleanup)
    sed -i '' 's|"@sgonzaloc/react-financial-charts/|"@sgonzaloc/react-financial-charts-|g' "$pkg"
    TOTAL_PKG=$((TOTAL_PKG + CHANGES))
  else
    echo "  $PKG_NAME: 0 changes"
  fi
done
echo "  Total packages changes: $TOTAL_PKG"

echo ""
echo "Source files (.ts, .tsx):"
# Count total occurrences of @react-financial-charts/ in all source files
SRC_CHANGES=$(grep -r "@react-financial-charts/" packages --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
echo "  $SRC_CHANGES changes"
# Replace all imports in source files
find packages -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@react-financial-charts/|@sgonzaloc/react-financial-charts-|g' 2>/dev/null

echo ""
echo "========================================="
echo "  TOTAL CHANGES: $((ROOT_CHANGES + TOTAL_PKG + SRC_CHANGES))"
echo "========================================="

# Count and replace file: dependencies
CHANGES=$(grep -l '"file:\.\./' packages/*/package.json | wc -l | tr -d ' ')
echo "📦 Files with file: dependencies: $CHANGES"
sed -i '' 's|"file:\.\./[^"]*"|"^3.0.0"|g' packages/*/package.json
echo "✅ Replaced in $CHANGES package.json files"

# Fix stories dependency (react-financial-charts without scope) - convert to scoped package
sed -i '' 's|"react-financial-charts": "[^"]*"|"@sgonzaloc/react-financial-charts": "^3.0.0"|g' packages/*/package.json
echo "✅ Fixed react-financial-charts dependency to @sgonzaloc/react-financial-charts"

echo ""
echo "Next steps:"
echo "   npm i"
echo "   npm run build"
echo "   npm run publish -- --access public"
echo "   git checkout -- ."
