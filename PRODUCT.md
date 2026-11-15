# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pneumaris is a solo music project. The site's primary visitor is a new
listener discovering the music, typically arriving from a release promotion
post, often on a phone. Their job is to confirm what they've found and start
listening.

Existing fans (returning for new releases, merch, or wallpapers) are a
secondary audience.

## Product Purpose

pneumarisband.com is the official home of Pneumaris: it presents the current
release, the catalogue, and the project, and routes visitors to listen.

Success is streams on Spotify and Apple Music. Other outcomes the site supports
(on-site SoundCloud playback, Etsy merch, the contact form, wallpaper
downloads) are secondary to that.

## Positioning

From the project's own album copy (`src/data/releases.ts`): Pneumaris brings
gothic and progressive metal into contact with industrial pop, coastal folk
horror, tango, heavy grooves, and intimate piano-led songs. The name joins
*pneuma* (breath, spirit) with Latin *aris* (altar, air). The project is
faceless: the identity is carried by the artwork and emblem, not by people.

## Operating Context

- Releases are frequent: six between May and November 2026 (EP, single, and
  albums). The newest release in `src/data/releases.ts` is featured on the
  homepage, so the homepage changes with every release.
- Each release is published on SoundCloud first and distributed to Spotify and
  Apple Music; there can be a gap between the two (Reverie: SoundCloud
  November 8, Spotify and Apple Music November 13, 2026). Store links are added
  only once they are verified live.
- Visitors arrive from social promotion: the header links Spotify, Apple Music,
  SoundCloud, YouTube, TikTok, X, Instagram, and Facebook.
- Merch is sold through an Etsy shop linked from the header. The link is
  hidden (`MERCH_SHOP_URL` is null in `src/config/site.ts`) while the shop is
  down.

## Capabilities and Constraints

- Static Astro site on Cloudflare Pages; the only server code is the contact
  form's Pages Function. Repo conventions are in `AGENTS.md`.
- Pages: home, music (track lists, a shared SoundCloud player that loads only
  after Play, artwork lightbox), about, extras (two free 3440x1440 wallpapers),
  contact (Turnstile-protected form), privacy policy, and 404.
- Spotify and Apple Music links are album-level; per-track links and on-site
  playback go through SoundCloud.
- Google Analytics loads only after opt-in consent. Any new third-party origin
  needs a CSP update in `public/_headers` and a privacy-policy update in the
  same change.

## Brand Commitments

- The name is Pneumaris. It is a solo project: never describe it as a band
  with members.
- Faceless: no member names, photos, or portrait imagery.
- No live performance: never add tour dates, a shows section, or ticket calls
  to action.
- Approved artwork, the circular Pneumaris emblem, and its header and intro
  derivatives are the identity assets (see `DESIGN.md` for their provenance).

## Evidence on Hand

- Release data for six releases, with album copy, track lists, durations,
  artwork, and SoundCloud, Spotify, and Apple Music URLs: `src/data/releases.ts`.
- Cover art and identity masters: `assets-src/`; optimized images:
  `public/images/`; wallpapers: `public/downloads/`.
- There are no press quotes, reviews, testimonials, listener counts, label, or
  awards on hand. Do not fabricate any.

## Product Principles

1. Every surface leads to listening, and Spotify and Apple Music are the
   destinations that count.
2. The release is the subject. The newest record leads, and the site is built
   to swap it with each release.
3. Only state what is true now. Release status, dates, and store links reflect
   verified availability, never a plan.
4. The music and the artwork speak for the project; never put a person,
   performance, or borrowed acclaim in their place.
