# Reverie visual direction

The subject is Pneumaris and its eighteen-song album Reverie. The audience is
listeners arriving from the release promotion. The first job is to identify the
album and get them listening on SoundCloud, while distinguishing the scheduled
November 13 streaming release from an available store link.

## Material and identity

Use the approved cover: the sleeping stone face, gold fractures, ruined gothic
arches, reflected doorway, star field, and violet stone. Keep the existing Cinzel
headings and Raleway body: Cinzel matches the inscription-like lettering on the
record; Raleway keeps the longer album and track descriptions readable. Retain
the circular Pneumaris emblem, older cover art, wallpaper, and existing biography.
The release imagery uses approved existing artwork; the new header and introduction
emblems adapt the original illustrated identity, as documented below.

## System

- Charcoal `#111015`: page and navigation ground.
- Violet stone `#19161e`: quiet section surface; raised surfaces use `#25202c`.
- Chalk `#eee9e3`: full body text.
- Lavender ash `#bdb6c5`: secondary text, drawn from the cover's stone.
- Weathered gold `#c4a576`: links; pale gold `#e0c393`: headings and primary action.
- Cinzel display: responsive 56-112px release title, 28-44px section headings,
  18-24px catalogue titles. Raleway body and primary controls: 16px, line height 1.6.
- Spacing base: 8px; existing responsive gutters and 1240px content measure.
  The main release uses a wider 1440px canvas to give the cover room.
- Square cover art; existing 2px control corners; no enclosing catalogue cards.
  Surfaces separate through tone. Dividers are reserved for navigation, footer,
  and track rows where they help scanning.
- No decorative motion. Keep menu and playback feedback and reduced-motion
  handling; remove the page entrance fade and decorative header blur.

## First viewport

```text
[emblem / Pneumaris]       [navigation] [platforms / socials]

The new album from Pneumaris     +-------------------------+
Reverie                         |                         |
                                |   Complete approved     |
Album description               |     Reverie cover       |
                                |                         |
[Listen on SoundCloud] Tracks    |                         |
Spotify & Apple Music date      +-------------------------+
```

On phones the full cover comes first, followed by title, listening action,
scheduled date, and description. Older releases become compact artwork rows.
The cover is the one dominant visual; no simulated stars, gradients, orbit
ornaments, autoplay, or generic feature cards compete with it.

## Content and asset sources

Album copy, track order, SoundCloud URLs, and track art come from the local
media library's `notes/releases/reverie/soundcloud-release.json` (public release
verified November 8-9). Durations are measured from its final WAV masters,
truncated to whole seconds, matching player time displays. The approved cover is promoted unchanged from
`assets/albums/reverie/artwork/reverie-cover-v1-upscaled-5016x5016.png` to
`assets-src/reverie.png`. The optimizer produces a 1200px WebP and a 1200x630
social image containing the full cover, without cropping its lettering.

November 13 is the requested distribution date supplied by the user. The library
records distribution as in review; the site says scheduled, and does not invent
Spotify or Apple Music album URLs. Add verified store URLs to the release data
and update the scheduled wording when those links are available.

## Header mark

Use the text-free hooded figure, stone eclipse halo, and antique-gold ritual axis
adapted from the original illustrated Pneumaris emblem. A simple crescent loses
the gothic, ethereal, cosmic horror character; an M monogram has no meaning for
the band. The header derivative retains the faceless figure and carved relief
but removes the redundant tiny band name. Its transparent background fits the
charcoal site ground. At 44-52px, the broad pale hood and halo supply the visual
structure; the smaller engraving adds texture rather than essential information.

`assets-src/header-emblem-v1.png` is the promoted generated master. The optimizer
emits the 208px alpha WebP `public/header-emblem-v1.webp`. The adjacent Cinzel
band name supplies the home link's accessible name; the image has empty alt text.
Original emblems remain unchanged for larger placements.

The built-in ImageGen edit used `assets-src/logo-circle.png` as its reference.
Exact prompt, original generated path, source and output provenance, and master
hash are recorded in the media library at
`sources/generated-images/2026-11-10/header-emblem-v1.json`.

The larger homepage introduction uses a matching companion with the wordmark,
promoted as `assets-src/intro-emblem-v1.png` and exported as
`public/intro-emblem-v1.webp` at 640px. The header continues to use the separate
text-free image. Its exact edit prompt and provenance are recorded in the media
library at `sources/generated-images/2026-11-10/intro-emblem-v1.json`.
