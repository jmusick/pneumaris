# Pneumaris Website

Official website for Pneumaris, built with Astro and deployed on Cloudflare Pages.

## Current Stack

- Astro 7
- astro-icon (Iconify / Simple Icons)
- TypeScript (strict Astro tsconfig)
- Cloudflare Pages (static output)
- Google Analytics 4 (gtag.js), gated behind an opt-in cookie consent banner
- Security response headers via `public/_headers` (CSP, HSTS, etc.)
- Web3Forms (contact form delivery)
- hCaptcha (bot protection)

## Current Version

- App package version: 1.17.1
- Site display version: 1.17.1

## Site Features

- Dark atmospheric visual theme with shared global styles
- Layered homepage artwork: a fixed environment with a curved character surface that turns toward the mouse, plus optional phone tilt
- Static character fallback when WebGL is unavailable or reduced motion is requested
- Motion pause control and automatic support for reduced-motion preferences
- Featured latest release, shared release data, and a wallpaper preview on the homepage
- Reusable site header and footer components
- Responsive pages:
	- Home (`/`)
	- Music (`/music/`) with album cards, descriptions, cover lightbox previews, and Spotify/SoundCloud playback
	- About (`/about/`)
	- Extras (`/extras/`) with a free desktop wallpaper download
	- Contact (`/contact/`) with Web3Forms + hCaptcha
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

## Music Page Highlights

- Data-backed album sections for current Pneumaris releases
- Per-album streaming links (SoundCloud, Spotify, Apple Music) with icons
- "Stream on" section at the bottom of the page with all three platforms
- Album metadata display:
	- Type (EP/Album)
	- Release date
	- Description
	- Track count
- Track lists and playback controls supplied by the embedded streaming player
- Track metadata also emitted as `MusicRecording` structured data
- Artwork lightbox modal:
	- Opens when clicking album cover art
	- Supports close button, backdrop click, and `Esc` key
- Embedded playback player per release: Spotify iframe when a `spotifyUrl` is set (all current releases), falling back to the SoundCloud playlist embed otherwise

## Contact Form

The contact form is client-side and submits directly to Web3Forms:

- Endpoint: `https://api.web3forms.com/submit`
- Access key: configured in `src/pages/contact.astro`
- CAPTCHA: hCaptcha widget token sent as `h-captcha-response`
- Honeypot field: `website`/`botcheck`

No Cloudflare Pages Functions are required for form delivery.

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
scripts/                Website image optimization and read-only HTTP audit
docs/                   Asset workflow and dated audit reports
public/_headers         Cloudflare Pages security response headers (CSP, HSTS, etc.)
src/components/         Shared UI components (header/footer/cookie consent banner)
src/config/             Site constants (site version, site URL, GA measurement ID)
src/layouts/            Shared page layout (Layout.astro)
src/pages/              Astro routes/pages
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
