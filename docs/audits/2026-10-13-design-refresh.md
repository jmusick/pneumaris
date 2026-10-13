# Design refresh verification — October 13, 2026

## Scope

Local production build for the 1.17.0 design refresh. Homepage, shared navigation
and footer, Music, About, Extras, Contact, and Privacy Policy. No deployment was
performed.

The homepage has a generated fixed environment and a transparent foreground
character. The foreground uses a shallow WebGL surface inferred from the
cutout's alpha outline, with a maximum of 18° horizontal turning and 5° vertical
turning. It rotates around a fixed anchor with no DOM translation. Environment, text and
controls remain fixed. Phone tilt is explicitly enabled by the visitor;
orientation readings stay in the browser. The privacy policy documents this.

## Passed checks

- `npm run build`: all six static routes and the sitemap generated successfully.
  Astro Icon retains its warning about the absent optional `src/icons` folder;
  packaged icons render correctly.
- `git diff --check`: no whitespace errors.
- Production preview tested in headless Microsoft Edge with Playwright at 1440,
  1101, 768, 390, and 320 pixels: one main landmark and one main heading per page,
  with no horizontal overflow on any route.
- Pointer movement rotates the rendered character surface, with no CSS
  transformation of the canvas. WebGL draws without errors; left, neutral,
  and right frames were captured and visually reviewed for changing perspective
  and silhouette. The hood's surface edges were refined to remove cracks.
  heading geometry and the environment's geometry/transform remain unchanged.
  Generated layers share 1920×784 derivative dimensions, and the character
  WebP retains non-opaque alpha. Both layers total 269,442 bytes.
  Pause/resume and live reduced-motion
  changes work. Motion settles without a continuous animation loop.
- Mobile navigation opens and closes, keeps closed links inert, and closes with
  Escape while returning focus to the toggle.
- Music artwork lightbox opens and closes with Escape. Empty contact submission
  displays the CAPTCHA message without sending a Web3Forms request. The compact
  CAPTCHA layout fits at 320 pixels.
- Cookie Choices reopens the consent banner. No Google Analytics or Tag Manager
  requests occurred before consent or after declining. No uncaught page errors.
- Simulated touch device: permission is requested only after Enable tilt;
  calibrated orientation events move the artwork; Disable tilt resets it;
  denied permission and missing sensor readings fall back gracefully. Initial
  reduced-motion preference hides the motion control and prevents the effect.
- Simulated graphics context loss and absent WebGL support restore the still SVG
  character and hide the motion control. Initial reduced motion skips renderer
  initialization. Canvas resolution is capped at 1.5× device-independent pixels,
  and drawing stops when motion settles or the hero is out of view.
- Album and track metadata moved to `src/data/releases.ts` was compared with the
  previous source: all original entries are preserved. The only additions are
  the homepage summary and the promoted local Anathema artwork reference.
- Desktop and mobile screenshots were visually reviewed for homepage and inner
  page layout. The local preview is served at `http://127.0.0.1:4322/`.

## Limits and references

Phone sensor tests used simulated events and permission responses in Edge.
Physical iPhone/Safari testing over HTTPS remains to be done, including portrait
and landscape calibration and graphics performance. The character surface is
an inferred relief suitable for modest angles; it does not reconstruct hidden
character details or support a full orbit around an authored 3D model.

Permission handling follows
[MDN's DeviceOrientationEvent.requestPermission documentation](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static).
The contact widget uses
[hCaptcha's documented compact size](https://docs.hcaptcha.com/configuration).
Rendering uses the native
[WebGL2 API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext),
with no additional runtime dependency or external origin.

No unresolved defect was found that requires a new backlog issue. Existing
analytics wording issue [#10](https://github.com/jmusick/pneumaris/issues/10) is
outside this design change.
