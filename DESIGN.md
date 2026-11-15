---
name: Pneumaris
description: Weathered violet stone and charcoal, with gold kept for the cracks where the light gets in.
colors:
  charcoal: "#111015"
  violet-stone: "#19161e"
  violet-stone-strong: "#201c26"
  violet-stone-raised: "#25202c"
  chalk: "#eee9e3"
  lavender-ash: "#bdb6c5"
  muted-ash: "#aaa1b1"
  weathered-gold: "#c4a576"
  pale-gold: "#e0c393"
  pale-gold-lit: "#ead7af"
  tarnished-gold: "#a48a65"
  hairline: "rgba(190, 174, 151, 0.25)"
  faded-rose: "#d4948f"
typography:
  display:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(3.5rem, 7.4vw, 7rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  page-title:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(2.75rem, 6vw, 5rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(1.75rem, 3vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(1.15rem, 2vw, 1.5rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0em"
  body:
    fontFamily: "Raleway, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  nav:
    fontFamily: "Cinzel, serif"
    fontSize: "0.85rem"
    fontWeight: 500
    letterSpacing: "0.035em"
  label:
    fontFamily: "Raleway, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.14em"
rounded:
  sm: "2px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
  gutter: "clamp(1.25rem, 4vw, 3.5rem)"
  content: "1240px"
  canvas: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.pale-gold}"
    textColor: "{colors.charcoal}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.35rem"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.pale-gold-lit}"
    textColor: "{colors.charcoal}"
  button-primary-active:
    backgroundColor: "{colors.weathered-gold}"
  button-streaming:
    backgroundColor: "{colors.violet-stone}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 0.5rem"
    height: "52px"
  button-streaming-hover:
    backgroundColor: "{colors.violet-stone-raised}"
    textColor: "{colors.pale-gold}"
  button-streaming-active:
    backgroundColor: "{colors.violet-stone-strong}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.pale-gold}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 0.75rem"
    height: "44px"
  text-link:
    textColor: "{colors.chalk}"
    typography: "{typography.body}"
    height: "44px"
  nav-link:
    textColor: "{colors.lavender-ash}"
    typography: "{typography.nav}"
    padding: "0.75rem 0.65rem"
  nav-link-active:
    textColor: "{colors.pale-gold}"
  social-link:
    textColor: "{colors.muted-ash}"
    rounded: "{rounded.sm}"
    size: "44px"
  social-link-hover:
    textColor: "{colors.weathered-gold}"
  input:
    backgroundColor: "rgba(22, 15, 10, 0.75)"
    textColor: "{colors.chalk}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.8rem 0.9rem"
---

# Design System: Pneumaris

## Overview

**Creative North Star: "The Gilded Ruin"**

Weathered stone with gold in the cracks. Everything on the page is restrained,
dark, and still, except where the light gets in. The palette comes straight
from the Reverie cover: violet-grey stone, a charcoal night, chalk-pale relief,
and gold that shows up in the fractures. Gold is not a fill colour for
surfaces. It is where emphasis lives: headings, the one primary action, focus
rings, and the hairline under a link.

The release's cover art is the one dominant image on every surface it appears
on. The interface keeps out of its way: no simulated stars, gradients, orbit
ornaments, autoplay, or decorative motion compete with it. Cinzel carries the
inscription-like lettering of the record into headings and navigation;
Raleway keeps longer album and track copy readable. Density is low, with
generous gutters and one idea per band of the page. Surfaces separate by tone
rather than by boxes and borders.

The identity is faceless. The circular Pneumaris emblem, its hooded-figure
header and intro derivatives, and the release artwork carry the project.
People and performance never do.

**Key Characteristics:**
- Dark-only (`color-scheme: dark`): charcoal ground, violet-stone surfaces, chalk text.
- Gold reserved for emphasis: headings, the primary action, focus, link underlines.
- Cover art leads; square, uncropped, never overlaid.
- Cinzel for display and navigation, Raleway for reading and controls.
- Flat, tonal layering; near-square 2px corners.
- No decorative motion; only feedback transitions, and all of them off under reduced motion.

## Colors

A cold violet-stone neutral family, lit by a single weathered-gold accent family.

### Primary
- **Pale Gold** (`pale-gold`): headings (all `h1`–`h4`), the filled primary
  action, active navigation, focus rings, text selection, and the text of
  outline buttons. The brightest thing on the page after the cover.
- **Weathered Gold** (`weathered-gold`): default link colour, icon tint inside
  controls, outline-button borders, the player's top rule, and the primary
  button's pressed state.
- **Pale Gold, Lit** (`pale-gold-lit`): hover state of the primary button only.
- **Tarnished Gold** (`tarnished-gold`): the quiet underline on text links,
  form-field borders at rest, the menu-toggle border, and the scrollbar thumb.

### Neutral
- **Charcoal** (`charcoal`): page ground, sticky header, and the text colour on
  gold fills.
- **Violet Stone** (`violet-stone`): quiet section surfaces (the homepage
  introduction band) and streaming buttons at rest.
- **Violet Stone, Strong** (`violet-stone-strong`): pressed controls and the skip link.
- **Violet Stone, Raised** (`violet-stone-raised`): hovered or focused surface controls.
- **Chalk** (`chalk`): body text and catalogue titles.
- **Lavender Ash** (`lavender-ash`): secondary text, nav links at rest, intro
  lines, track numbers and durations, form labels.
- **Muted Ash** (`muted-ash`): the quietest text: footer credit, social icons at rest.
- **Hairline** (`hairline`): the one divider colour, used for the header and
  footer rules, track-row separators, page-header base, and album meta borders.
- **Faded Rose** (`faded-rose`): form error text and invalid-field borders. The
  only non-palette hue; never decorative.

### Named Rules
**The Gold-in-the-Cracks Rule.** Gold marks emphasis, never area. The only gold
fill is the single primary action; everything else gold is text, a line, an
icon, or a focus ring.

**The One Stone Rule.** All neutrals come from the violet-stone family. The warm
browns left from the earlier palette (`#100e0b`, `#0d0a07`, `rgba(22, 15, 10, …)`,
`rgba(8, 6, 4, …)`, and the older gold `rgba(184, 154, 106, …)`) still appear in
the player, lightbox, form fields and hover tints. Treat them as drift and move
them onto the tokens above when those components are next touched.

## Typography

**Display Font:** Cinzel (with serif), weights 400–700 loaded, 500 used.
**Body Font:** Raleway (with sans-serif), weights 300–500 and italics loaded, 400 and 500 used.

**Character:** Cinzel is carved inscription: capitals-forward, classical, the
lettering on the record itself. Raleway is a clean, slightly geometric reader
that keeps eighteen-track descriptions comfortable without competing.

### Hierarchy
- **Display** (Cinzel 500, `clamp(3.5rem, 7.4vw, 7rem)`; up to 14vw on phones, 1.1, -0.035em): the release title on the homepage, in pale gold. One per page.
- **Page Title** (Cinzel 500, `clamp(2.75rem, 6vw, 5rem)`, 1.15, 0.02em): the shared page header on interior pages.
- **Headline** (Cinzel 500, `clamp(1.75rem, 3vw, 2.75rem)`, 1.2, -0.015em): section headings. The first album on /music/ steps up to `clamp(2.5rem, 5vw, 4rem)`.
- **Title** (Cinzel 500, `clamp(1.15rem, 2vw, 1.5rem)`, 1.2): catalogue and album titles. In chalk, not gold, so they read as items rather than headings.
- **Body** (Raleway 400, 1rem, 1.6): all running text; capped at 49–52ch in hero and intro copy and 70ch in album descriptions. `text-wrap: pretty`.
- **Nav** (Cinzel 500, 0.85rem, 0.035em): header navigation, form labels (at 0.025em), and album detail lines.
- **Label** (Raleway 400, 0.75rem, 0.14em, uppercase): small group labels such as "Listen on".

### Named Rules
**The Inscription Rule.** Cinzel is for names, headings, and navigation: things
that would be carved. Never set paragraphs, durations, or form input in it.

**The Readable Floor Rule.** Running text and control labels stay at 1rem.
Nothing a visitor must read goes below 0.875rem (track numbers and player
messages are the floor). The cookie banner's 11.5px text is below this floor.

## Layout

- **Measure:** content sits in a 1240px column (`content`) with responsive
  gutters (`gutter`, 20–56px). The release hero and the header use a wider
  1440px canvas so the cover has room.
- **Rhythm:** an 8px base. Sections are separated by
  `clamp(3rem–4rem, 6–7vw, 5–6rem)` of vertical space, not by rules.
- **Release hero:** two columns (copy `1fr`, cover `1.12fr`), vertically
  centred. At 800px and below it becomes one column with the full cover first,
  then the title, the listening actions, the explore link, and the description.
- **Catalogue:** three equal columns of square artwork with titles beneath,
  with no card around them. Below 480px each release becomes a compact row
  (112px artwork, then the text).
- **Track lists:** a grid row of number, 72px artwork, title, duration, and
  Play. Below 600px it becomes 56px artwork, title over duration, and an
  icon-only Play.
- **Breakpoints in use:** 1100px (header collapses to the menu toggle), 800px
  (hero and split sections stack), 720px (about page stacks), 600px (track
  rows compact), 480px (streaming buttons stack full-width and the catalogue
  becomes rows).

### Named Rules
**The One Image Rule.** Each band of the page has at most one image, and on the
release hero it is the cover. Nothing overlays or crops it.

## Elevation & Depth

Flat and tonal. Surfaces rest on the charcoal ground and separate by stepping
through the violet-stone family (`violet-stone` → `violet-stone-strong` →
`violet-stone-raised`), not by shadow or border. Shadows exist only on things
that genuinely float above the page: the fixed track player, the artwork
lightbox, and the album artwork on /music/. They are always plain black,
ambient, and soft.

### Shadow Vocabulary
- **Artwork lift** (`box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35)`): album artwork on /music/.
- **Player** (`box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.4)`): the fixed bottom player.
- **Lightbox** (`box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6)`): the artwork dialog.

### Named Rules
**The Flat Stone Rule.** Nothing in the page flow casts a shadow. Only fixed or
modal layers do.

## Shapes

Near-square. Every control, field, artwork frame and player button uses the
same 2px corner (`rounded.sm`): enough to soften the pixel edge, never enough
to read as rounded. Cover art is square and uncropped (`object-fit: contain`).
Borders are 1px, either `hairline` for structure or a gold for interactive
edges. The emblem is the only circle in the system.

Remaining exceptions are drift, not vocabulary: the menu toggle (0.4rem), the
artwork trigger (0.25rem), the lightbox dialog (0.55rem), and its round close
button (999px).

## Components

### Buttons
Quiet and carved: thin gold-edged outlines and near-square corners that stay
out of the artwork's way. Only the one primary action is filled.
- **Shape:** near-square (2px), minimum 44px tall; hero streaming buttons are 52px.
- **Primary:** pale-gold fill, charcoal text, Raleway 500. Hover lifts to
  pale-gold-lit, press drops to weathered gold. One per view at most. It is
  defined globally but not currently used on the homepage hero.
- **Streaming:** violet-stone surface, hairline border, chalk label with a
  weathered-gold platform icon. On hover or focus the border turns gold, the
  surface rises, and the label turns pale gold.
- **Outline (track Play, album links, player controls):** transparent, 1px
  gold or tarnished-gold border, pale-gold label. On hover a faint gold wash
  appears behind it. On narrow screens track Play becomes icon-only.
- **Focus:** a global 2px pale-gold outline offset 5px (3px inside the player
  and track lists).

### Text Links
Chalk text with a 1px tarnished-gold underline drawn as a bottom border,
44px minimum target. The underline turns pale gold on hover. Links inside
running text use a real underline so colour is never the only cue.

### Inputs / Fields
- **Style:** 1px tarnished-gold border, 2px corners, dark translucent fill,
  chalk text, pale-gold caret; Cinzel labels above in lavender ash.
- **Focus:** border turns pale gold with a soft 2px gold halo; no outline.
- **Error:** faded-rose border and a faded-rose message below the field, tied
  to it with `aria-describedby`.

### Navigation
- **Header:** sticky, charcoal, hairline base rule. The text-free emblem
  (44–52px) sits beside the Cinzel wordmark "Pneumaris" in pale gold. Nav
  links are Cinzel in lavender ash, and the active or hovered link turns pale
  gold with a weathered-gold underline. Social icons are 44px, muted ash, and
  turn weathered gold on hover.
- **Mobile (≤1100px):** an outline menu toggle opens an inline panel that
  pushes the page down (no overlay); links go full width, socials wrap below a
  hairline. Esc closes it.
- **Footer:** hairline top rule; lavender-ash links (Privacy Policy, Cookie
  Choices, Sitemap) that turn gold on hover; muted-ash credit and version.

### Track Player
Fixed to the bottom edge with a weathered-gold top rule and the player shadow.
It shows 48px artwork, the title, outline play/pause and skip controls, and a
gold-accented seek range with tabular time. It is hidden until the first Play;
the SoundCloud widget loads only then.

### Brand Mark
- **Header emblem:** a text-free hooded figure, a stone eclipse halo, and an
  antique-gold ritual axis, adapted from the original circular emblem. At
  44–52px the pale hood and halo carry the shape and the engraving adds
  texture. Empty alt text; the adjacent wordmark names the link.
- **Intro emblem:** the companion with the wordmark, shown up to 280px (180px
  on phones) in the homepage introduction band.
- The original circular emblem stays unchanged for larger placements. A
  crescent or an "M" monogram is not a substitute: one loses the gothic,
  cosmic-horror character and the other means nothing for the project.

## Do's and Don'ts

### Do:
- **Do** let the current release's full, uncropped cover be the one dominant image on the homepage.
- **Do** keep gold for emphasis: headings, one filled primary action, focus rings, link underlines.
- **Do** separate sections by tone (charcoal ↔ violet stone) and space, keeping dividers for the header, footer, and track rows.
- **Do** use the 2px corner and 1px borders on every new control, and keep targets at least 44px.
- **Do** keep Cinzel for names, headings and navigation, and Raleway at 1rem for everything read.
- **Do** honour `prefers-reduced-motion`; feedback transitions are 160–240ms colour and opacity changes only.

### Don't:
- **Don't** add simulated stars, gradients, orbit ornaments, autoplay, or entrance animations that compete with the cover.
- **Don't** wrap catalogue items in cards or boxes.
- **Don't** fill surfaces with gold, or use more than one filled gold button in a view.
- **Don't** introduce warm-brown neutrals or the older `rgba(184, 154, 106, …)` gold; use the violet-stone and gold tokens.
- **Don't** use people, faces, or performance imagery; the artwork and emblem carry the identity.
- **Don't** add decorative blur to the header or a fade-in to the page.

## Asset Provenance

- **Release artwork:** promoted unchanged from the local media library into
  `assets-src/` (Reverie: `assets/albums/reverie/artwork/reverie-cover-v1-upscaled-5016x5016.png`
  → `assets-src/reverie.png`). `scripts/optimize-images.mjs` emits a 1200px
  WebP and a 1200×630 social image that contains the full cover without
  cropping its lettering.
- **Header emblem:** `assets-src/header-emblem-v1.png` is the promoted
  generated master, edited from the original circle logo (kept in the media
  library's `assets/brand/`). The optimizer emits the 208px alpha WebP
  `public/images/header-emblem-v1.webp`. The prompt, generated path,
  provenance, and master hash are in the media library at
  `sources/generated-images/2026-11-10/header-emblem-v1.json`.
- **Intro emblem:** `assets-src/intro-emblem-v1.png`, exported as
  `public/images/intro-emblem-v1.webp` at 640px. Provenance is in
  `sources/generated-images/2026-11-10/intro-emblem-v1.json`.
- **Release data:** album copy, track order, SoundCloud URLs and track art come
  from the media library's release notes (for example
  `notes/releases/reverie/soundcloud-release.json`). Durations are measured
  from the final WAV masters, truncated to whole seconds to match the player.
