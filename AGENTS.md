# AGENTS.md

Guidance for AI coding agents working in this repo.

## Stack

- Astro 6, TypeScript (strict), no UI framework
- Static output, deployed to Cloudflare Pages (`wrangler.toml`)
- Site config (name, URL, version) lives in `src/config/site.ts`
- Shared page chrome comes from `src/layouts/Layout.astro` (meta tags, GA4, JSON-LD slot) plus `src/components/SiteHeader.astro` / `SiteFooter.astro`
- Pages live in `src/pages/*.astro`, one file per route, each building its own `pageTitle`/`pageDescription`/`canonicalUrl`/`socialImageUrl` and passing them into `Layout`

## Conventions

- Internal links must use a trailing slash (`/music/`, not `/music`) — Cloudflare Pages 301s the no-slash form, and Astro's own canonical URLs/sitemap use the slash form. A no-slash internal link creates a needless redirect hop that Search Console flags.
- Images referenced from components/pages live in `public/` as already-optimized `.webp` (or `.jpg` for the social share image) with explicit `width`/`height` attributes on every `<img>` to avoid layout shift. Original hi-res source PNGs live in `assets-src/` (not deployed — excluded from the Cloudflare Pages build output). Run `node scripts/optimize-images.mjs` (requires `sharp`, already a transitive dependency) to regenerate the `public/` derivatives after replacing a file in `assets-src/`.
- Fonts (Cinzel, Raleway) load via a `<link rel="preconnect">` + `<link rel="stylesheet">` pair in `Layout.astro`'s `<head>` — do not switch this back to a CSS `@import`, which serializes the font fetch behind the stylesheet fetch.
- JSON-LD structured data is passed into `Layout` via the `structuredData` prop and rendered as a single `<script type="application/ld+json">`. The homepage defines the canonical `MusicGroup` entity at `${SITE_URL}/#musicgroup`; other structured data (e.g. the `MusicAlbum` entries on the music page) reference it by `@id` rather than repeating the entity.

## Deployment / infra notes

- DNS, TLS, and HTTP→HTTPS / non-www→apex redirects are managed in the Cloudflare dashboard (Rules → Redirect Rules), not in this repo. There is no `_redirects` or `_headers` file — don't add one without also removing the equivalent Cloudflare Redirect Rule, or the two will conflict.
- Google Search Console issues are the usual way problems with the live site surface. When investigating one, check both the code (canonical tags, sitemap, internal links) and the live HTTP behavior (`curl -I` against the affected URLs) — the bug is as often in Cloudflare config as in the Astro source.

## Before committing

- `npm run build` should complete cleanly (Astro will fail the build on broken frontmatter/type errors).
- Bump `SITE_VERSION` in `src/config/site.ts` for user-visible changes, matching the pattern in recent commits (footer displays this version).
