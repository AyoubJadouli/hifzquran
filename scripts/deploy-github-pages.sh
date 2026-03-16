#!/usr/bin/env bash
set -euo pipefail

# Deploy Vite build to GitHub Pages branch (gh-pages)
#
# Required env vars:
# - GH_TOKEN: GitHub Personal Access Token (repo write)
# - GH_REPO: owner/repo (example: AyoubJadouli/hifzquran)
#
# Optional:
# - GH_PAGES_BRANCH (default: gh-pages)

GH_PAGES_BRANCH="${GH_PAGES_BRANCH:-gh-pages}"

if [[ -z "${GH_TOKEN:-}" || -z "${GH_REPO:-}" ]]; then
  echo "❌ Missing GH_TOKEN or GH_REPO"
  echo "Example: GH_TOKEN=xxxx GH_REPO=AyoubJadouli/hifzquran ./scripts/deploy-github-pages.sh"
  exit 1
fi

echo "🔧 Installing dependencies"
npm ci

echo "🏗️ Building app"
npm run build

if [[ ! -d "dist" ]]; then
  echo "❌ dist/ not found"
  exit 1
fi

# SPA fallback for GitHub Pages refresh on deep links
cp dist/index.html dist/404.html

TMP_DIR=".tmp-gh-pages"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

echo "📦 Preparing gh-pages content"
cp -R dist/. "$TMP_DIR/"

cd "$TMP_DIR"
git init
git checkout -b "$GH_PAGES_BRANCH"
git add .
git commit -m "Deploy to GitHub Pages $(date -u +'%Y-%m-%dT%H:%M:%SZ')"

REMOTE_URL="https://x-access-token:${GH_TOKEN}@github.com/${GH_REPO}.git"
echo "🚀 Pushing to ${GH_REPO}:${GH_PAGES_BRANCH}"
git push --force "$REMOTE_URL" "$GH_PAGES_BRANCH"

cd ..
rm -rf "$TMP_DIR"

echo "✅ Deployed to GitHub Pages branch: ${GH_PAGES_BRANCH}"
