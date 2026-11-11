# Reverie promotion refresh

November 10, 2026. Local implementation, version 1.19.0. Design direction is in
`DESIGN.md`; approved asset promotion is documented in `docs/asset-workflow.md`.

## Tells

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/pages/index.astro:57`, `src/pages/index.astro:76` | Generic band introduction occupied the first screen; newest release followed below. | Reverie title, complete approved cover, direct SoundCloud action, scheduled streaming date; real earlier releases below. | Visitors arriving for the promotion immediately see the record and how to listen. |
| LOW | `public/universal.css:126`, `src/pages/music.astro:124` | Decorative header blur and enclosing album panels. | Opaque charcoal navigation, open album sections, restrained controls. | Let the cover and track artwork supply the atmosphere. |

## Floor

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `public/universal.css:1`, `src/layouts/Layout.astro:42` | Warm brown palette, small footer text, several undersized navigation targets; no browser theme color. | Cover-derived charcoal, violet stone, gold; 16px footer text, 44px social/menu targets, selection/scrollbar colors, matching browser theme. | Keep text, controls, and native browser surfaces coherent. |
| LOW | `src/pages/music.astro:124` | Faint streaming-button boundaries and small uppercase labels. | Stronger gold boundaries and 16px platform labels. | Streaming choices are easier to read and identify as controls. |

## Motion

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| LOW | `public/universal.css:75`, `src/pages/index.astro:57` | Whole-page entrance fade and interactive character scene. | Static release artwork; no decorative entrance animation. | The released album artwork is the central visual, available immediately. Existing player feedback and reduced-motion behavior remain. |

## Critique

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/pages/index.astro:143` | First mobile draft placed the long description before the listening action. | At phone width, actions and date precede the description. | At 390x844, the main listening button occupies y606-654, visible on the first screen. |

Two screenshot rounds were used, with the mobile action placement corrected
between rounds. Desktop gives the full cover the largest area; mobile retains
the full uncropped image and uses compact artwork rows for the older catalogue.
Cinzel and Raleway are retained deliberately: the former matches the lettering
on the actual record; the latter provides continuity and readable album copy.
There are no sample claims, testimonials, placeholders, or replacement content.
No flagged tell was retained at the user's request; the source lint needs no
allow-list.

## Verification

- `npm test`: passed static build, security checks for all seven pages, and all
  ten consent, playback, 404, and sitemap tests.
- Build emits the existing astro-icon warning about the absent optional
  `src/icons` directory; supplied Iconify icons render in the browser.
- Design-taste lint: four changed UI files, zero FAIL and zero WARN.
- `git diff --check`: passed.
- Used the requested Browser plugin for all browser work.
- Full-page homepage and music captures at 1440px and 390px were opened and
  inspected. Lazy images were brought into view before final captures.
- At 390px, no horizontal overflow on home, music, about, extras, contact,
  or privacy-policy routes (checked rendered document width).
- Mobile menu opens, Escape closes it, and the toggle reports the correct
  expanded state.
- Reverie artwork preview opens and closes with Escape.
- Music page renders eighteen Reverie tracks. Before Play, no SoundCloud
  iframe exists. Playing The Bough Breaks loads the player and progresses;
  stop closes the player. Browser console inspection returned no errors or
  warnings at that point.
- Public SoundCloud album page confirms title, copy, and November 8 release.
  Durations come from final WAV masters, truncated to whole seconds; the
  first track's 5:07 matches the live SoundCloud player.
- Cover WebP: 156,228 bytes; social JPEG: 55,384 bytes. Original master is
  retained separately under `assets-src/` and excluded from the deployed site.

Screenshots are local artifacts under
`C:/Users/JD/.codex/artifacts/pneumaris-reverie/`:
`home-desktop.png`, `home-mobile.png`, `home-hero.png`,
`music-desktop.png`, and `music-mobile.png`.

Not verified: full automated accessibility audit, screen-reader testing,
production Cloudflare behavior after deployment, and future Spotify/Apple Music
availability. No site deployment was performed. November 13 remains explicitly
scheduled; add verified album URLs and update the schedule when delivered.
The distribution record is currently in review and mentions possible delivery
delays. No new external origins, analytics behavior, or data collection were
introduced. No unresolved implementation issue requiring a new backlog item
was identified in this scoped review.

## Wallpaper follow-up, v1.19.1

Added the second wallpaper identified by the user in their iCloud Wallpapers
folder. Both Extras entries have distinct previews, descriptive titles, alt
text, and PNG downloads. The homepage now mentions two wallpapers. Per the
user's follow-up, both downloads are 3440 x 1440. The second is resized with a
slight centered crop rather than stretched; its original 6336 x 2688 master
remains untouched. Source filename and promotion are in `docs/asset-workflow.md`.

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| LOW | `src/pages/extras.astro:1` | Only the original wallpaper was offered; preview had a color filter. | Both real artworks are shown without a filter, with separate labeled download links. | Show the approved artwork accurately and make both files findable. |

Verification: `npm test` passed all ten tests plus build/security checks.
Design lint, including the shared reduced-motion rules in `public/universal.css`,
returned zero FAIL and zero WARN. Full-page Extras screenshots at 1440px and
390px were opened and inspected; no mobile horizontal overflow. Both download
links were clicked in Browser, and the saved PNG files were checked byte-for-byte
against the deployed files and measured at 3440 x 1440. Screenshots are saved as
`extras-desktop.png` and `extras-mobile.png` beside the other captures. The
changes remain local; production deployment is not verified.

## Header follow-up, v1.19.2

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/components/SiteHeader.astro:60`, `public/universal.css:145` | The detailed illustrated emblem included a tiny unreadable second band name. | A simple gold eclipse SVG beside the existing readable band name. | Carries the celestial imagery from existing artwork at header scale without repeating text. |

The user rejected an M monogram because it has no meaning for the band. The
final header uses no letter monogram. Its decorative SVG inherits the gold
color token; the home link retains the accessible name Pneumaris. Verified
header appearance in Browser at 1440px and 390px, with a 44px mobile symbol and
no horizontal overflow. Captures: `header-desktop.png`, `header-mobile.png`.
This follow-up inspected header/viewport screenshots, not another full-page
critique. `npm test` passes all ten tests and security/build checks. Design lint
reports zero FAIL and zero WARN. Changes remain local and undeployed.

## Approved illustrated emblems, v1.19.3

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/components/SiteHeader.astro:56`, `src/pages/index.astro:97` | The simplified eclipse did not convey the band's gothic, ethereal, cosmic horror identity. The homepage used the previous lettered emblem. | Text-free illustrated hooded emblem in the header; matching wordmark companion in the introduction. | Preserve the faceless figure, stone halo, gold axis, and engraved relief while reserving lettering for the large placement. |

The user approved the text-free illustrated emblem and requested the wordmark
companion for Between silence and fury. Both were created with built-in ImageGen
using the existing emblem as the starting reference, with no changes to original
assets. Exact prompts and source/generated path provenance are saved in the media
library's `sources/generated-images/2026-11-10/` under `header-emblem-v1.json`
and `intro-emblem-v1.json`. PNG masters are verified byte-for-byte in both
`assets-src/` and the media library's `assets/brand/`; WebP derivatives are also
retained in its `assets/brand/web/`. The second 3440 x 1440 wallpaper derivative
is retained under `assets/wallpapers/pneumaris-wallpaper-2-3440x1440.png` as well.

Verified in the requested Browser plugin at 1440px and 390px: correct distinct
image URLs in header and introduction, loaded wordmark image, no horizontal
overflow, readable adjacent header name, and full-page screenshot inspection.
Saved `home-desktop.png`, `home-mobile.png`, `intro-wordmark-desktop.png`, and
updated header crops in the capture folder. The first preview already matched
the approved composition; later captures corrected lazy image loading and
transient scrolling artifacts without changing the layout. `npm test` passes
all ten tests and static security/build checks. Design lint reports zero FAIL
and zero WARN across changed header, homepage, and shared CSS. Production
deployment and a full accessibility audit remain not verified.

## v2.0.0 release validation

The user requested a major release using the minor skill's commit/tag/push
workflow. Intermediate 1.19.x values above were local draft versions from this
session; the final package, lockfile root, site display version, and README are
2.0.0. The latest prior tag is v1.18.2. Existing annotated tag style is retained.
No changelog exists, so none was created.

A fresh npm ci completed with zero reported vulnerabilities; npm test passed the
build/security checks and all ten tests with the locked dependencies installed.
The six changed UI files passed design lint with zero FAIL and zero WARN.
The release review restored an accidental dependency-range edit so package and
lockfile changes contain only the intended root version bump. New binaries are
the required source artwork masters and optimized display/download assets;
source masters remain outside dist. No build output or credentials are staged.
