# Token Setup Guide (Cloudflare + GitHub)

This guide helps you set up the exact tokens required to deploy this app to Cloudflare Pages.

---

## 1) Create Cloudflare API Token

Go to:

- Cloudflare Dashboard → **My Profile** → **API Tokens** → **Create Token**

Use either:

- **Template**: *Edit Cloudflare Workers* (recommended as base), then adjust permissions below
- or **Custom Token**

### Minimum required permissions

Set these permissions for the token:

1. `Account` → `Cloudflare Pages` → **Edit**
2. `Account` → `Workers Scripts` → **Edit** (needed by Wrangler in some deploy flows)
3. `Zone` → `DNS` → **Edit** (only if script should attach custom domain / DNS ops)

### Account resources

- Include: your account (the one hosting `los.ma`)

### Zone resources (optional but recommended)

- Include: `los.ma` (if handling custom domain with automation)

Create token and copy it once shown.

---

## 2) Find your Cloudflare Account ID

Any of these methods:

- In Cloudflare Dashboard URL when inside account

---

## 3) Add GitHub Secrets (for auto-deploy)

Repo: `AyoubJadouli/hifzquran`

Go to:

- GitHub → Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these two secrets:

1. `CLOUDFLARE_API_TOKEN` = your Cloudflare API token
2. `CLOUDFLARE_ACCOUNT_ID` = your Cloudflare account ID

After saving, push to `main` to trigger:

- `.github/workflows/deploy-cloudflare-pages.yml`

---

## 4) Local Script Token Setup

For `scripts/deploy-cloudflare-pages.sh`, export env vars:

```bash
export CF_API_TOKEN="<your_cloudflare_api_token>"
export CF_ACCOUNT_ID="<your_cloudflare_account_id>"
export CF_PAGES_PROJECT="hifzquran"
export CF_CUSTOM_DOMAIN="hifzquran.los.ma"
```

Then deploy:

```bash
./scripts/deploy-cloudflare-pages.sh
```

---

## 5) Quick Validation Commands

### Validate token can access Pages API

```bash
curl -s -H "Authorization: Bearer $CF_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/pages/projects" | jq
```

If token is correct, response contains `"success": true`.

### Validate GitHub secrets are used

Push a commit to `main`, then check:

- GitHub → **Actions** → `Deploy to Cloudflare Pages`

---

## 6) Common Token Errors

### Error: `Authentication error [code: 10000]`

- Token invalid/expired, or wrong account ID.

### Error: `not enough permissions`

- Missing `Cloudflare Pages:Edit` permission.

### Error when attaching domain

- Add `Zone:DNS Edit` permission for `los.ma`.

---

## 7) Security Best Practices

- Never commit tokens in code or `.env` tracked by Git.
- Store tokens only in GitHub Secrets / local shell environment.
- Rotate token if accidentally exposed.
- Use minimum required scope.
