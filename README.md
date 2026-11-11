# Pneumaris Website

Official website for Pneumaris, built with Astro and deployed on Cloudflare Pages.

## Current Stack

- Astro 7
- astro-icon (Iconify / Simple Icons)
- TypeScript (strict Astro tsconfig)
- Cloudflare Pages (static output)
- Google Analytics 4 (gtag.js), gated behind an opt-in cookie consent banner
- Security response headers via `public/_headers` (CSP, HSTS, etc.)
- CSP blocks executable inline scripts and event handlers; application scripts
  are emitted as same-origin files, including the opt-in analytics loader.
- One Cloudflare Pages Function (`functions/api/contact.ts`) for the contact form
- Cloudflare Email Sending (contact form delivery)
- Cloudflare Turnstile (contact form bot protection)

## Current Version

- App package version: 2.0.0
- Site display version: 2.0.0

## Site Features

- Dark atmospheric visual theme with shared global styles
- Reverie-led homepage with approved cover artwork, SoundCloud listening link, and scheduled Spotify / Apple Music release date
- Charcoal, muted violet, and weathered gold palette with responsive artwork and catalogue layouts
- No decorative entrance motion; reduced-motion support for existing controls
- Featured latest release, shared release data, and a wallpaper preview on the homepage
- Reusable site header and footer components
- Header Merch link opens the band's Etsy shop
- Responsive pages:
	- Home (`/`)
	- Music (`/music/`) with album cards, descriptions, custom track lists, and album/track artwork lightbox previews
	- About (`/about/`)
	- Extras (`/extras/`) with two free 3440 x 1440 desktop wallpaper downloads
	- Contact (`/contact/`) with Turnstile and Cloudflare Email Sending
	- Privacy Policy (`/privacy-policy/`)
- Social links in header:
	- Spotify
	- Apple Music
	- SoundCloud
	- YouTube
	- TikTok
	- X
	- Instagram
	- Facebook
- Footer: Privacy Policy, Cookie Choices (reopens the consent banner), Sitemap, version badge (sourced from `src/config/site.ts`)
- Shared page layout via `src/layouts/Layout.astro` (meta tags, skip link, header/footer, cookie consent banner)
- Google Analytics 4, opt-in only: `src/components/CookieConsent.astro` is the only thing that loads `gtag.js`, and only after a visitor accepts
- Google Fonts loads independently of analytics consent; the banner and privacy
  policy explain this separately.

## Music Page Highlights

- Data-backed album sections for current Pneumaris releases
- Per-album streaming links (SoundCloud, Spotify, Apple Music) with icons
- "Stream on" section at the bottom of the page with all three platforms
- Album metadata display:
	- Type (Single/EP/Album)
	- Release date
	- Description
	- Track count
- Custom track lists with artwork, titles, durations, and Play buttons for listening within the site through SoundCloud
- Shared player bar with play/pause, seeking, SoundCloud attribution, and automatic advance within a release
- SoundCloud's widget and API script load only after Play; optional SoundCloud controls provide direct access to the native player
- Track metadata also emitted as `MusicRecording` structured data
- Artwork lightbox modal:
	- Opens when clicking album or track artwork, requesting original-size SoundCloud images with a fallback to the stored artwork URL
	- Supports close button, backdrop click, and `Esc` key
	- Keeps keyboard focus inside the dialog and returns it to the artwork trigger when closed
- Spotify and Apple Music remain available through album streaming links

Release metadata and streaming URLs live in `src/data/releases.ts`; the first
entry is featured on the homepage. The music page renders track lists directly
from this data; keep titles, durations, artwork URLs, and SoundCloud track links
in sync with the published releases. Track titles link to SoundCloud; Spotify
and Apple Music links open the album. Streaming playback loads on demand.

## Contact Form

The contact form checks its fields in the browser, then posts JSON to
`/api/contact`, a Cloudflare Pages Function in
[functions/api/contact.ts](functions/api/contact.ts). The Function validates the
fields again, verifies the Cloudflare Turnstile token, and sends one email
through the Cloudflare Email Sending REST API:

- From `contact@pneumarisband.com` (pneumarisband.com is onboarded in Email Sending)
- To `hello@pneumarisband.com`, which Email Routing's catch-all forwards to the band's mailbox
- Reply-to: the visitor's address
- Honeypot field: `website`
- Turnstile widget: `pneumaris-contact-form` (hostname pneumarisband.com); its
  site key is `TURNSTILE_SITE_KEY` in `src/config/site.ts`

Configuration is split between `wrangler.toml` `[vars]` (account ID and the
from/to addresses; dashboard plaintext variables are ignored when the file
exists) and two secrets set on the Pages project, under Settings > Variables
and secrets or with `npx wrangler pages secret put NAME --project-name pneumaris`:

- `CLOUDFLARE_API_TOKEN`: an account API token with **Email Sending: Edit**
- `TURNSTILE_SECRET_KEY`: the `pneumaris-contact-form` widget's secret

Without either secret the endpoint answers 503 with a `code` naming what's
missing. Preview deployments on `*.pages.dev` can't send: the widget only
allows pneumarisband.com, and the secrets are set for production. Every response carries an `X-Request-Id` that matches one structured
log line; stream them with
`npx wrangler pages deployment tail --project-name pneumaris`. Logs never
include what the visitor typed.

`astro dev` doesn't serve Pages Functions, so sending fails there (the page
says so); field validation still works. To run the real endpoint locally,
copy `.dev.vars.example` to `.dev.vars`, then build with Turnstile's test site
key and serve the build with Wrangler:

```bash
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build
```

```bash
npx wrangler pages dev dist
```

With `CLOUDFLARE_API_TOKEN` left empty, everything up to the send step runs and
the form reports the 503. Rebuild without the variable before deploying by
hand.

## Local Development

Requirements:

- Node.js 22.23.4 or newer (Astro 7.4.2's minimum; `.node-version` pins 22.23.4)

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

The dev server listens on localhost only. To test from another device on your
network, opt in explicitly with `npm run dev:network`.

Build production output:

```bash
npm run build
```

The build also checks the emitted HTML and CSP for executable inline scripts,
inline event handlers, valid JSON-LD, and Cloudflare header line limits.
Run `npm test` to build and verify the deployed consent bundle's opt-in,
decline, withdrawal, and blocked-storage behavior, plus playback loading,
retries, seeking, release boundaries, and rapid track changes.

CI (`.github/workflows/ci.yml`) calls the shared `jmusick/ci` baseline and
web-app workflows, pinned by commit SHA, and runs `npm test` (which builds).
The **CI gate** job is the single check to require on `master`. Dependabot
proposes new `jmusick/ci` releases and action pins.

Preview production build:

```bash
npm run preview
```

## Deployment (Cloudflare Pages)

- Build command: `npm run build`
- Build output directory: `dist`
- Wrangler config: `wrangler.toml`
- Node.js version: `.node-version` pins 22.23.4 for the build.
- If Cloudflare Pages has a `NODE_VERSION` environment override, remove it to
  use the repository pin or set it to `22.23.4` or newer in both production
  and preview environments.

## Project Structure

```text
public/                 Static assets (logo, header art, global CSS)
assets-src/             Tracked website image masters (not deployed)
scripts/                Image optimization, HTTP audit, and build security checks
docs/                   Asset workflow and dated audit reports
public/_headers         Cloudflare Pages security response headers (CSP, HSTS, etc.)
src/components/         Shared UI components (header/footer/consent/player)
src/config/             Site constants (site version, site URL, GA measurement ID)
src/data/               Shared release and track metadata (releases.ts)
src/layouts/            Shared page layout (Layout.astro)
src/lib/                WebGL character renderer and SoundCloud playback controller
src/pages/              Astro routes/pages
tests/                  Consent and playback tests against built application bundles
wrangler.toml           Cloudflare Pages build config
```

## Asset Library and Documentation

The media library lives in `C:\Users\JD\projects\pneumaris`, with lowercase
kebab-case folders for release media, brand assets, wallpapers, drafts, and
recovery records. Website code and engineering documentation stay in this repo.
Creative notes and release planning belong in the asset library's `notes/`
folders. The Obsidian vault was intentionally deleted and is no longer used.

See [asset ownership and promotion](docs/asset-workflow.md) for the directory
map and the workflow from library masters to `assets-src/` and `public/`.
GitHub Issues are the shared findings backlog; dated reports live in
[`docs/audits/`](docs/audits/).

## Social & Streaming Profiles

- Spotify: https://open.spotify.com/artist/0LwtEDzdDXRarZ1H4eLqnU
- Apple Music: https://music.apple.com/us/artist/pneumaris/1896511324
- SoundCloud: https://soundcloud.com/pneumaris
- YouTube: https://www.youtube.com/@Pneumaris
- TikTok: https://www.tiktok.com/@pneumaris
- X: https://x.com/pneumarisband
- Instagram: https://www.instagram.com/pneumaris/
- Facebook: https://www.facebook.com/profile.php?id=61589446647657
