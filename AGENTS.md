# AGENTS.md

Guidance for AI coding agents working in this repo.

## What this is

Marketing site for **Pneumaris**, a band. Astro static site, deployed to
Cloudflare Pages. No Cloudflare Pages Functions — everything, including the
contact form, runs client-side or against a third-party endpoint. See
[README.md](README.md) for the feature list and current version.

## Stack

- Astro 7, TypeScript (strict), no UI framework — components are `.astro`
  files with inline `<style>`/`<script>`.
- Static output only. There is no server runtime and no API routes; don't add
  one without a real reason, since the whole deployment model (Cloudflare
  Pages, no Functions) assumes there isn't.
- Site config (name, URL, version, GA measurement ID) lives in
  `src/config/site.ts`.
- Node.js 22.23.4 or newer is required; `.node-version` pins the Cloudflare
  Pages build runtime. Keep `package.json`'s engine requirement and the
  README deployment instructions in sync when raising this minimum.
- Shared page chrome comes from `src/layouts/Layout.astro` (meta tags,
  skip link, JSON-LD slot, cookie consent banner) plus
  `src/components/SiteHeader.astro` / `SiteFooter.astro`.
- Pages live in `src/pages/*.astro`, one file per route, each building its own
  `pageTitle`/`pageDescription`/`canonicalUrl`/`socialImageUrl` and passing
  them into `Layout`.
- Icons via `astro-icon` + `@iconify-json/simple-icons` / `lucide`.

## Structure

- `src/pages/` — routes: `index.astro`, `music.astro`, `about.astro`,
  `extras.astro`, `contact.astro`, `privacy-policy.astro`.
- `src/components/` — `SiteHeader.astro`, `SiteFooter.astro`,
  `CookieConsent.astro` (see Analytics & consent below).
- `src/layouts/Layout.astro` — shared page shell.
- `src/data/releases.ts` — shared release and track metadata, artwork, and
  streaming links; the first release is featured on the homepage. The music
  page renders its own track lists. Track Play buttons control a shared
  SoundCloud widget through `TrackPlayer.astro` and `src/lib/track-player.ts`.
  The widget and its API script load only after Play; keep this lazy loading
  and the matching CSP script/frame origins. Spotify and Apple Music links are
  album-level. Artwork thumbnails and
  original-size previews come from SoundCloud's image CDN; the dialog falls
  back to the stored artwork URL if an original is unavailable.
- `src/config/site.ts` — single source of truth for `SITE_URL`, `SITE_NAME`,
  `SITE_VERSION` (sourced from the release process, not hand-edited day to
  day), `GA_MEASUREMENT_ID`, and `ANALYTICS_ID`.
- `public/_headers` — Cloudflare Pages security response headers (CSP, HSTS,
  etc.). See CSP below before adding any new external origin.
- `public/robots.txt` — hand-maintained; its `Sitemap:` line must match
  `SITE_URL`. Keep `astro.config.mjs`'s `site` URL in sync as well.

## Conventions

- Website code and engineering documentation belong in this repo. The local
  media library is `C:\Users\JD\projects\pneumaris`; all its folders use
  lowercase kebab-case. Creative notes and release planning belong in the asset
  library's `notes/` folders. The Obsidian vault was intentionally deleted and
  is no longer part of this project; do not recreate it or depend on it.
  See [docs/asset-workflow.md](docs/asset-workflow.md) for ownership and promotion
  rules. Preserve recovery attachment filenames and original source provenance.
- GitHub Issues are the shared audit backlog. Store dated audit evidence and
  issue links under `docs/audits/`; `TODO.md` is ignored local scratch space.

- Internal links must use a trailing slash (`/music/`, not `/music`) —
  Cloudflare Pages redirects the no-slash form (308 observed on 2026-10-12), and Astro's own canonical
  URLs/sitemap use the slash form. A no-slash internal link creates a
  needless redirect hop that Search Console flags.
- Local display images live in `public/` as already-optimized `.webp` (or
  `.jpg` for the social share image). Other album covers currently use
  SoundCloud-hosted JPEGs. Keep explicit `width`/`height` attributes on page
  images to avoid layout shift; the dynamically populated lightbox is the
  existing exception. Responsive album covers use `height: auto` and
  `object-fit: contain` so the HTML height does not cause cropping.
  Original hi-res source PNGs live in `assets-src/` (not deployed —
  excluded from the Cloudflare Pages build output). Run
  `node scripts/optimize-images.mjs` (requires `sharp`, a dev dependency)
  to regenerate the `public/` derivatives after replacing a file
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
element in the accept path. Nothing is requested from Google Analytics before a visitor
agrees — don't "simplify" this by putting the tag back in `Layout.astro`'s
head, which would disclose visitor IPs to Google before consent and defeat
the whole mechanism. The choice is stored in `localStorage` (not a cookie);
withdrawing it clears `_ga*` cookies and reloads. Any element with
`data-cookie-preferences` reopens the banner — the footer's "Cookie Choices"
button uses this. Google Fonts load independently in `Layout.astro`; the strict
opt-in rule applies to GA scripts and collection requests. Keep banner and
policy wording scoped to Google Analytics and explain the separate font requests.

## Security headers (CSP)

`public/_headers` sets a real `Content-Security-Policy`, not a
report-only one — it fails closed. Executable inline scripts and event-handler
attributes are blocked. Keep component scripts processed by Astro and pass
server values through escaped data attributes; `vite.build.assetsInlineLimit: 0`
keeps small bundles external. JSON-LD stays an inert inline data block. Adding any new external script, iframe,
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

- `npm test` (build plus consent and playback tests) must pass; CI runs it through the
  shared `jmusick/ci` workflows in `.github/workflows/ci.yml`. Keep those
  `uses:` pins on a commit SHA with the release tag as a comment.
- `npm run build` should complete cleanly; it builds the static pages and runs
  security checks. It does not run a separate TypeScript type check.
- Bump `SITE_VERSION` in `src/config/site.ts` for user-visible changes,
  matching the pattern in recent commits (footer displays this version).
- The privacy policy describes actual behavior. Adding a newsletter, embed,
  or further third-party script means updating
  `src/pages/privacy-policy.astro` (including its "Last updated" date) in the
  same change — it currently documents Cloudflare, Google Analytics, Google
  Fonts, Web3Forms, hCaptcha, SoundCloud, Spotify, and Apple Music. Keep that
  list true.
