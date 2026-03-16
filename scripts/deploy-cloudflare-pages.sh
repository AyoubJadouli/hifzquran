#!/usr/bin/env bash
set -euo pipefail

# Deploy this Vite app to Cloudflare Pages using API + token auth.
#
# Required env vars:
# - CF_API_TOKEN=
# - CF_ACCOUNT_ID=c87cba18160f2c5e712e60cc776fe2fb
#
# Optional env vars:
# - CF_PAGES_PROJECT (default: hifzquran)
# - CF_CUSTOM_DOMAIN (example: hifzquran.los.ma)
# - CF_PRODUCTION_BRANCH (default: main)

CF_PAGES_PROJECT="${CF_PAGES_PROJECT:-hifzquran}"
CF_PRODUCTION_BRANCH="${CF_PRODUCTION_BRANCH:-main}"
CF_CUSTOM_DOMAIN="${CF_CUSTOM_DOMAIN:-}"

if [[ -z "${CF_API_TOKEN:-}" || -z "${CF_ACCOUNT_ID:-}" ]]; then
  echo "❌ Missing required env vars: CF_API_TOKEN and/or CF_ACCOUNT_ID"
  exit 1
fi

echo "🔧 Installing dependencies"
npm ci

echo "🏗️ Building app"
npm run build

if [[ ! -d "dist" ]]; then
  echo "❌ Build output directory 'dist' not found"
  exit 1
fi

API_BASE="https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects"
AUTH_HEADER="Authorization: Bearer ${CF_API_TOKEN}"

echo "🔍 Checking Cloudflare Pages project: ${CF_PAGES_PROJECT}"
STATUS=$(curl -s -o /tmp/cf_project_check.json -w "%{http_code}" \
  -H "${AUTH_HEADER}" \
  -H "Content-Type: application/json" \
  "${API_BASE}/${CF_PAGES_PROJECT}")

if [[ "${STATUS}" == "404" ]]; then
  echo "➕ Creating Cloudflare Pages project: ${CF_PAGES_PROJECT}"
  CREATE_PAYLOAD=$(cat <<JSON
{
  "name": "${CF_PAGES_PROJECT}",
  "production_branch": "${CF_PRODUCTION_BRANCH}"
}
JSON
)

  curl -s -X POST \
    -H "${AUTH_HEADER}" \
    -H "Content-Type: application/json" \
    -d "${CREATE_PAYLOAD}" \
    "${API_BASE}" | jq -e '.success == true' >/dev/null
  echo "✅ Project created"
elif [[ "${STATUS}" == "200" ]]; then
  echo "✅ Project exists"
else
  echo "❌ Failed checking project. HTTP ${STATUS}"
  cat /tmp/cf_project_check.json
  exit 1
fi

echo "🚀 Deploying dist/ to Cloudflare Pages"
npx wrangler pages deploy dist \
  --project-name "${CF_PAGES_PROJECT}" \
  --branch "${CF_PRODUCTION_BRANCH}"

if [[ -n "${CF_CUSTOM_DOMAIN}" ]]; then
  echo "🌐 Ensuring custom domain is attached: ${CF_CUSTOM_DOMAIN}"
  DOMAIN_PAYLOAD=$(cat <<JSON
{
  "name": "${CF_CUSTOM_DOMAIN}"
}
JSON
)
  curl -s -X POST \
    -H "${AUTH_HEADER}" \
    -H "Content-Type: application/json" \
    -d "${DOMAIN_PAYLOAD}" \
    "${API_BASE}/${CF_PAGES_PROJECT}/domains" | jq -r '.success // "false"' >/dev/null || true
  echo "ℹ️ Domain attach requested (ignore if already attached)."
fi

echo "✅ Done. Your app is deployed to Cloudflare Pages." 
