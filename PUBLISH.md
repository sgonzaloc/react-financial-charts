# Publishing Guide

## Prerequisites

-   Logged into npm: `npm login`
-   Clean working directory: `git status` should show no changes

## Steps to Publish

### 1. Bump version

```bash
# Patch (bug fixes): 3.0.2 → 3.0.3
npm version patch --workspaces --no-git-tag-version
npm version patch --no-git-tag-version

# Minor (new features): 3.0.2 → 3.1.0
npm version minor --workspaces --no-git-tag-version
npm version minor --no-git-tag-version

# Major (breaking changes): 3.0.2 → 4.0.0
npm version major --workspaces --no-git-tag-version
npm version major --no-git-tag-version
```

### 2. Commit and tag

```bash
VERSION=$(node -p "require('./packages/charts/package.json').version")
git add .
git commit -m "chore: bump version to $VERSION"
git tag v$VERSION
git push && git push --tags
```

### 3. Publish to npm

```bash
npm publish --workspaces --access public
```

### 4. Create GitHub release (optional)

Go to: https://github.com/sgonzaloc/react-financial-charts/releases

-   Click "Draft a new release"
-   Select tag: v$VERSION
-   Title: v$VERSION
-   Description: Paste changelog
-   Click "Publish release"
