# NUC7 Studios Website

Rebuilt as an Astro site for `nuc7.com`, with:

- Astro for the public site
- Decap CMS at `/admin`
- Cloudflare Pages Functions for owner-only GitHub OAuth and stats APIs
- Cloudflare KV for WordPress-style website stats

## Local development

Install dependencies:

```powershell
npm install
```

Run the Astro site:

```powershell
npm run dev
```

Build the production output:

```powershell
npm run build
```

Preview the built site with Cloudflare Pages Functions:

```powershell
npx wrangler pages dev dist
```

## Required Cloudflare environment values

Set these in the Cloudflare Pages project before production use:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_REPO_ID` (optional)
- `OWNER_GITHUB_EMAIL` (set to `alivirgo123@live.com`)
- `SESSION_SECRET` (long random string used to sign secure owner sessions)
- `SITE_TIMEZONE` (for daily stats buckets, for example `Asia/Karachi`)

The KV binding is already configured in [wrangler.jsonc](/D:/Learning/nuc7%20website/nuc7-website/wrangler.jsonc).

## CMS

- Admin path: `/admin`
- Access: only the GitHub account whose verified email matches `OWNER_GITHUB_EMAIL`
- Backend: GitHub repo `alivirgo/nuc7-website`
- Content managed in:
  - `src/content/apps`
  - `src/content/pages`

Privacy policies remain source-controlled in `src/content/privacy` so Google Play links stay stable and do not depend on CMS edits.

## Stats dashboard

- Dashboard path: `/site-stats/`
- Access: same owner-only GitHub session used for `/admin`
- API routes:
  - `/api/stats/track`
  - `/api/stats/report`

Tracked data includes:

- visitors
- page views
- top pages
- referrers
- countries
- devices
- browsers
- click events

Owner-only routes like `/admin` and `/site-stats` are excluded from tracking to keep the numbers cleaner.

## Protected routes

These routes are behind the owner GitHub sign-in flow:

- `/admin`
- `/site-stats`
- `/api/stats/report`
