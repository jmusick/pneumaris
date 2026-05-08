# Pneumaris Website

Official website for Pneumaris, built with Astro.

## Stack

- Astro
- astro-icon (Iconify)
- TypeScript config (strict Astro tsconfig)

## Version

- App package version: 1.0.1
- Site display version: 1.0.1

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

## Project Structure

```text
functions/api/          Cloudflare Pages Functions (contact API)
public/                 Static assets (logo, header art, global CSS)
src/components/         Shared UI components (header/footer)
src/config/             Site constants (site version)
src/pages/              Astro routes/pages
```

## Contact Form (Brevo)

The contact page submits to `POST /api/contact`, implemented as a Cloudflare Pages Function in `functions/api/contact.ts`.

Set these environment variables in Cloudflare Pages:

- `BREVO_API_KEY` (required)
- `BREVO_SENDER_EMAIL` (required, must be a verified sender in Brevo)
- `BREVO_SENDER_NAME` (optional, defaults to `Pneumaris Contact`)
- `CONTACT_TO_EMAIL` (optional, defaults to `contact@pneumarisband.com`)

## Social Links

- SoundCloud: https://soundcloud.com/pneumaris
- YouTube: https://www.youtube.com/@Pneumaris
- TikTok: https://www.tiktok.com/@pneumaris
- X: https://x.com/pneumarisband
- Instagram: https://www.instagram.com/pneumaris/
- Facebook: https://www.facebook.com/profile.php?id=61589446647657
