# AGENTS.md

Guidance for AI coding agents working in this repo.

## What this is

Marketing site for **Pneumaris**, a band. Astro static site, deployed to
Cloudflare Pages. No Cloudflare Pages Functions — everything, including the
contact form, runs client-side or against a third-party endpoint. See
[README.md](README.md) for the feature list and current version.

## Stack

- Astro 6, TypeScript (strict), no UI framework — components are `.astro`
  files with inline `<style>`/`<script>`.
- Static output only. There is no server runtime and no API routes; don't add
  one without a real reason, since the whole deployment model (Cloudflare
  Pages, no Functions) assumes there isn't.
- Site config (name, URL, version, GA measurement ID) lives in
  `src/config/site.ts`.
- Shared page chrome comes from `src/layouts/Layout.astro` (meta tags,
  skip link, JSON-LD slot, cookie consent banner) plus
  `src/components/SiteHeader.astro` / `SiteFooter.astro`.
- Pages live in `src/pages/*.astro`, one file per route, each building its own
  `pageTitle`/`pageDescription`/`canonicalUrl`/`socialImageUrl` and passing
  them into `Layout`.
- Icons via `astro-icon` + `@iconify-json/simple-icons` / `lucide`.

## Structure

- `src/pages/` — routes: `index.astro`, `music.astro`, `about.astro`,
  `contact.astro`, `privacy-policy.astro`.
- `src/components/` — `SiteHeader.astro`, `SiteFooter.astro`,
  `CookieConsent.astro` (see Analytics & consent below).
- `src/layouts/Layout.astro` — shared page shell.
- `src/config/site.ts` — single source of truth for `SITE_URL`, `SITE_NAME`,
  `SITE_VERSION` (sourced from the release process, not hand-edited day to
  day), `GA_MEASUREMENT_ID`, and `ANALYTICS_ID`.
- `public/_headers` — Cloudflare Pages security response headers (CSP, HSTS,
  etc.). See CSP below before adding any new external origin.
- `public/robots.txt` — hand-maintained; its `Sitemap:` line must match
  `SITE_URL`.

## Conventions

- Internal links must use a trailing slash (`/music/`, not `/music`) —
  Cloudflare Pages 301s the no-slash form, and Astro's own canonical
  URLs/sitemap use the slash form. A no-slash internal link creates a
  needless redirect hop that Search Console flags.
- Images referenced from components/pages live in `public/` as
  already-optimized `.webp` (or `.jpg` for the social share image) with
  explicit `width`/`height` attributes on every `<img>` to avoid layout
  shift. Original hi-res source PNGs live in `assets-src/` (not deployed —
  excluded from the Cloudflare Pages build output). Run
  `node scripts/optimize-images.mjs` (requires `sharp`, already a transitive
  dependency) to regenerate the `public/` derivatives after replacing a file
  in `assets-src/`.
- Fonts (Cinzel, Raleway) load via a `<link rel="preconnect">` + `<link
  rel="stylesheet">` pair in `Layout.astro`'s `<head>` — do not switch this
  back to a CSS `@import`, which serializes the font fetch behind the
  stylesheet fetch.
- JSON-LD structured data is passed into `Layout` via the `structuredData`
  prop and rendered as a single `<script type="application/ld+json">`. The
  homepage defines the canonical `MusicGroup` entity at
  `${SITE_URL}/#musicgroup`; other structured data (e.g. the `MusicAlbum`
  entries on the music page) reference it by `@id` rather than repeating the
  entity.
- Every page's `<main>` carries `id="main"`, matching the skip link in
  `Layout.astro`. Keep that pairing when adding a page.

## Analytics & consent

Analytics is Google Analytics 4, configured by `GA_MEASUREMENT_ID` in
`src/config/site.ts`. Setting that to `null` removes the tag and the consent
banner site-wide. `ANALYTICS_ID` in the same file is null outside production,
so `astro dev` traffic never reaches the property.

Consent is **opt-in and strict**: `src/components/CookieConsent.astro` owns
the banner and is the only thing that loads `gtag.js`, by creating the script
element in the accept path. Nothing is requested from Google before a visitor
agrees — don't "simplify" this by putting the tag back in `Layout.astro`'s
head, which would disclose visitor IPs to Google before consent and defeat
the whole mechanism. The choice is stored in `localStorage` (not a cookie);
withdrawing it clears `_ga*` cookies and reloads. Any element with
`data-cookie-preferences` reopens the banner — the footer's "Cookie Choices"
button uses this, and the privacy policy links it inline.

## Security headers (CSP)

`public/_headers` sets a real `Content-Security-Policy`, not a
report-only one — it fails closed. Adding any new external script, iframe,
stylesheet, font, or `fetch()` target (a new embed platform, a new analytics
snippet, a new form backend) means adding its origin to the matching
directive in `public/_headers` **in the same change**, or the browser silently
blocks the request in production while everything looks fine in `astro dev`
(which doesn't serve this file at all). This already happened once: Cloudflare
auto-injects its own Web Analytics beacon script
(`static.cloudflareinsights.com`) independent of anything in this repo's
source, and the first CSP pass didn't account for it — it was silently
blocked until caught by inspecting the Network tab in production. When
debugging a "works in dev, broken in prod" report involving a network
request, check the browser console for a CSP violation before assuming it's
a code bug.

## Deployment / infra notes

- DNS, TLS, and HTTP→HTTPS / non-www→apex redirects are managed in the
  Cloudflare dashboard (Rules → Redirect Rules), not in this repo — there is
  no `_redirects` file. `public/_headers`, by contrast, **does** live in this
  repo and is the only place response headers are set; don't recreate any of
  it as a Cloudflare Transform Rule, or the two will drift out of sync
  silently.
- Google Search Console issues are the usual way problems with the live site
  surface. When investigating one, check both the code (canonical tags,
  sitemap, internal links) and the live HTTP behavior (`curl -I` against the
  affected URLs) — the bug is as often in Cloudflare config as in the Astro
  source.

## Before committing

- `npm run build` should complete cleanly (Astro will fail the build on
  broken frontmatter/type errors).
- Bump `SITE_VERSION` in `src/config/site.ts` for user-visible changes,
  matching the pattern in recent commits (footer displays this version).
- The privacy policy describes actual behavior. Adding a newsletter, embed,
  or further third-party script means updating
  `src/pages/privacy-policy.astro` (including its "Last updated" date) in the
  same change — it currently documents Cloudflare, Google Analytics, Google
  Fonts, Web3Forms, hCaptcha, SoundCloud, Spotify, and Apple Music. Keep that
  list true.
