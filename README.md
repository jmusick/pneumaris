# Pneumaris Website

Official website for Pneumaris, built with Astro and deployed on Cloudflare Pages.

## Current Stack

- Astro 6
- astro-icon (Iconify)
- TypeScript (strict Astro tsconfig)
- Cloudflare Pages (static output)
- Web3Forms (contact form delivery)
- hCaptcha (bot protection)

## Current Version

- App package version: 1.2.1
- Site display version: 1.2.1

## Site Features

- Dark atmospheric visual theme with shared global styles
- Reusable site header and footer components
- Responsive pages:
	- Home (`/`)
	- Music (`/music`) with album cards, descriptions, track lists, per-track artwork, lightbox previews, and SoundCloud playlist playback
	- About (`/about`)
	- Contact (`/contact`) with Web3Forms + hCaptcha
	- Privacy Policy (`/privacy-policy`)
- Social links in header:
	- SoundCloud
	- YouTube
	- TikTok
	- X
	- Instagram
	- Facebook
- Footer version badge sourced from `src/config/site.ts`

## Music Page Highlights

- Data-backed album sections for current Pneumaris releases
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
- Embedded SoundCloud playlist players per release

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
src/components/         Shared UI components (header/footer)
src/config/             Site constants (site version)
src/pages/              Astro routes/pages
wrangler.toml           Cloudflare Pages build config
```

## Social Profiles

- SoundCloud: https://soundcloud.com/pneumaris
- YouTube: https://www.youtube.com/@Pneumaris
- TikTok: https://www.tiktok.com/@pneumaris
- X: https://x.com/pneumarisband
- Instagram: https://www.instagram.com/pneumaris/
- Facebook: https://www.facebook.com/profile.php?id=61589446647657
