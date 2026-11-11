# Asset ownership and website promotion

## Locations

| Location | Responsibility |
| --- | --- |
| `C:\Users\JD\source\pneumaris` | Website source, build scripts, README, AGENTS, and engineering audits |
| `C:\Users\JD\projects\pneumaris` | Media library, release lyrics, creative drafts/notes, and recovery evidence |

The asset library's `README.md` is its local index. Keep technical site guidance
in this repo and link to it instead of maintaining copies in the media library.
The Obsidian vault was intentionally deleted and is no longer used. Do not
recreate it or treat its absence as a missing dependency.

## Library conventions

All asset-library folders use lowercase kebab-case. Release media lives under
`assets/albums/<release>/{audio,artwork,lyrics,videos}/`. Brand media and wallpapers
live under `assets/brand/` and `assets/wallpapers/`. Song drafts and generation
notes live under `drafts/songs/`; explicitly named artwork drafts live under
`drafts/artwork/<release-or-brand>/`.

New biographies, band background, release plans, and editorial notes belong in
`notes/band/` or `notes/releases/<release>/` in the asset library; create these
folders as needed. Website setup, deployment, implementation guidance, and
audits belong in this repo's documentation.

Recovery archives belong in `sources/recovered-from-chatgpt/<date>/`. Preserve
original attachment filenames and original provenance source paths. Use kebab-case
for new curated filenames. `sources/organization/2026-10-12/file-moves.csv` records
the old/new paths and hashes of the 216 files present before the organization pass.
The obsolete vault-based lyric importer is retained only as historical evidence
under `sources/legacy-tools/lyric-importer/`, outside the active workflow.

## Promote an asset into the website

1. Choose the intended master from the library. Retained variants and drafts do
   not imply approval for publication.
2. Copy it into `assets-src/` under the filename expected by
   `scripts/optimize-images.mjs`. These tracked inputs make builds reproducible
   independently of the local library.
3. Run `node scripts/optimize-images.mjs` to regenerate derivatives in `public/`.
4. Reference the derivative with descriptive alt text and explicit dimensions.
   Downloadable PNGs may live in `public/downloads/`; display images use WebP
   and the social image uses JPEG.
5. Run `npm run build`. For new third-party origins, update `public/_headers` and
   the privacy policy in the same change. Follow the release process for visible
   site changes.

The deployed wallpaper is copied from `assets-src/wallpaper-1.png`; the library
retains it as `assets/wallpapers/pneumaris-wallpaper-1.png`. The library wordmark
maps to `assets-src/logo.png`; selected header and circle logo inputs map to
`assets-src/header.png` and `assets-src/logo-circle.png`. Replacing a library
file alone does not update the site.

The Anathema cover is promoted from
`assets/albums/anathema/artwork/anathema-3000x3000.png` to
`assets-src/anathema.png`, with a 960px WebP derivative in `public/anathema.webp`.
The homepage catalogue and music page share its reference through `src/data/releases.ts`.

The featured Reverie cover is promoted from
`assets/albums/reverie/artwork/reverie-cover-v1-upscaled-5016x5016.png` to
`assets-src/reverie.png`. The optimizer generates `public/reverie.webp` (1200px)
and `public/reverie-social.jpg` (1200x630, full cover contained on charcoal).
Release copy, URLs, track order, and track artwork are sourced from
`notes/releases/reverie/soundcloud-release.json`; durations are measured from the
final WAV masters. See `DESIGN.md` for the release promotion design.

The previous layered homepage used two generated masters from
`assets/brand/hero-layers/`: `hero-environment-v1.png` (empty background plate)
and `hero-character-v1.png` (transparent character cutout). These retained components are no longer mounted on the homepage. Their promoted
copies live under the same filenames in `assets-src/`, and the optimizer emits
matching 1920×784 WebPs in `public/`. The original complete `header.png` is
retained for the About page and social image.

Original generation filenames, input reference, and full prompts are preserved
in the library's `sources/generated-images/2026-10-13/hero-layers-v1.json` and
the adjacent original PNG files. `ParallaxScene.astro` registers the character
at 88% scale inside the shared canvas. SVG image placement provides the still
fallback. `src/lib/character-surface.ts` samples the cutout's alpha outline to
build a shallow, rounded WebGL surface for small turns. The environment and DOM
layout remain fixed; the renderer rotates the character geometry. This is an
approximation from the front artwork, not a complete authored 3D character.

## Audit tracking

GitHub Issues are the actionable backlog. Dated scope, evidence, passed checks,
limitations, and issue links belong in `docs/audits/`. `TODO.md` is an ignored
local scratch file, not the shared backlog. Do not copy private lyrics, recovery
exports, or local provenance into public issues.

## Second wallpaper

The second wallpaper master is copied unchanged to `assets-src/wallpaper-2.png`
from `C:/Users/JD/iCloudDrive/Wallpapers/` under its original filename
`Upscaled Image-Nano Banana - Massively enhance image quality and fidelity_ Increase resolution_ add rich micro-deta.png`.
The media library already retains that same original filename under
`assets/wallpapers/`; neither original was renamed or overwritten.

The original is 6336 x 2688. At the user's request, the optimizer generates
`public/downloads/pneumaris-wallpaper-2-3440x1440.png` using a centered cover crop
(no stretching), then generates `public/wallpaper-2-preview.webp` from the
actual download. The existing first wallpaper download URL remains valid.
Both wallpapers are listed on Extras with their own download links.

## Text-free header emblem

`assets/brand/header-emblem-v1.png` is a transparent text-free adaptation of the
existing illustrated hooded emblem, generated with the built-in ImageGen tool.
The original logo files are retained. The promoted master is
`assets-src/header-emblem-v1.png`; the optimizer emits the 208px
`public/header-emblem-v1.webp` for a 44-52px header display. Exact prompt and
provenance are in the library's
`sources/generated-images/2026-11-10/header-emblem-v1.json`.

The matching wordmark companion is retained as
`assets/brand/intro-emblem-v1.png`, promoted to
`assets-src/intro-emblem-v1.png`, and optimized to the 640px
`public/intro-emblem-v1.webp`. It is used only in the homepage introduction;
the header uses the text-free emblem. Its exact edit prompt and source hash
are in `sources/generated-images/2026-11-10/intro-emblem-v1.json`.

Copies of both new emblem WebP derivatives are retained in the media library's
`assets/brand/web/`. The generated 3440 x 1440 second wallpaper is retained as
`assets/wallpapers/pneumaris-wallpaper-2-3440x1440.png`. Original sources remain
unchanged. Website builds continue to use the promoted masters in this repo,
independently of the local media library.
