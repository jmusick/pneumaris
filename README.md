# Pneumaris Website

Official website for Pneumaris, built with Astro and deployed on Cloudflare Pages.

## Current Stack

- Astro 6
- astro-icon (Iconify / Simple Icons)
- TypeScript (strict Astro tsconfig)
- Cloudflare Pages (static output)
- Google Analytics 4 (gtag.js), gated behind an opt-in cookie consent banner
- Security response headers via `public/_headers` (CSP, HSTS, etc.)
- Web3Forms (contact form delivery)
- hCaptcha (bot protection)

## Current Version

- App package version: 1.12.2
- Site display version: 1.12.2

## Site Features

- Dark atmospheric visual theme with shared global styles
- Reusable site header and footer components
- Responsive pages:
	- Home (`/`)
	- Music (`/music/`) with album cards, descriptions, track lists, per-track artwork, lightbox previews, and Spotify/SoundCloud playback
	- About (`/about/`)
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
- Full track lists with:
	- Individual track artwork thumbnails
	- Track durations
	- Direct links to each SoundCloud track
- Artwork lightbox modal:
	- Opens when clicking album art or track art
	- Supports close button, backdrop click, and `Esc` key
- Embedded playback player per release — Spotify iframe when a `spotifyUrl` is set (all current releases), falling back to the SoundCloud playlist embed otherwise

## Contact Form

The contact form is client-side and submits directly to Web3Forms:

- Endpoint: `https://api.web3forms.com/submit`
- Access key: configured in `src/pages/contact.astro`
- CAPTCHA: hCaptcha widget token sent as `h-captcha-response`
- Honeypot field: `website`/`botcheck`

No Cloudflare Pages Functions are required for form delivery.

## Local Development

Requirements:

- Node.js 22.12.0 or newer

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

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
- Recommended environment variable in Cloudflare Pages:
	- `NODE_VERSION=22.12.0`

## Project Structure

```text
public/                 Static assets (logo, header art, global CSS)
public/_headers         Cloudflare Pages security response headers (CSP, HSTS, etc.)
src/components/         Shared UI components (header/footer/cookie consent banner)
src/config/             Site constants (site version, site URL, GA measurement ID)
src/layouts/            Shared page layout (Layout.astro)
src/pages/              Astro routes/pages
wrangler.toml           Cloudflare Pages build config
```

## Social & Streaming Profiles

- Spotify: https://open.spotify.com/artist/0LwtEDzdDXRarZ1H4eLqnU
- Apple Music: https://music.apple.com/us/artist/pneumaris/1896511324
- SoundCloud: https://soundcloud.com/pneumaris
- YouTube: https://www.youtube.com/@Pneumaris
- TikTok: https://www.tiktok.com/@pneumaris
- X: https://x.com/pneumarisband
- Instagram: https://www.instagram.com/pneumaris/
- Facebook: https://www.facebook.com/profile.php?id=61589446647657
