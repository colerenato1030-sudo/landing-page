---
name: debugging
description: Systematically debug a layout, styling, or script.js behavior bug on this landing page. Use when something looks wrong in the browser or a script.js interaction misbehaves (carousel, headline fitting, mobile nav).
license: MIT
---

# Debugging this landing page

This is a static, no-build site — the whole surface is `index.html`, `styles.css`, `script.js`.

1. **Reproduce first.** Serve the folder (`python3 -m http.server 8000`) and confirm the exact symptom before touching code — don't guess from the description alone.
2. **Narrow by layer.** The hero is three stacked layers in one grid cell (sky → type → subject → caption → nav, per `README.md`). A visual bug there is almost always a z-index, `grid-template-areas`, or `min-width: 0` issue, not a JS issue.
3. **Headline-fit bugs** (text overflowing or too small): check `script.js`'s `fit()` function — it measures `line` at `MEASURE=200px` against `stage.clientWidth`. A wrong result usually means the stage's padding changed, or a new element inside `.stage` widened its grid track (missing `min-width: 0`).
4. **Carousel bugs**: check the `slides` array and `render()`/`go()` in `script.js` — index wraparound uses `(index + step + slides.length) % slides.length`.
5. **Mobile nav bugs**: check the `toggle`/`menu` listeners near the top of `script.js` — `aria-expanded` must stay in sync with the `is-open` class.
6. Confirm the fix at 320px, 768px, and 1440px widths before calling it done — this codebase has broken before on nowrap headings widening their own grid track.
