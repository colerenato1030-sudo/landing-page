# AceTennis — landing page

A static landing page. No build step: open `index.html`, or serve the folder.

```bash
python3 -m http.server 8000
```

## The hero

The hero is built as three stacked layers inside one CSS grid cell, so the
display type sits **behind** the players and the figures interrupt the
letterforms:

| z-index | Layer | Element |
| --- | --- | --- |
| 0 | Sky + clouds | `.hero__sky` |
| 1 | Display type | `.stage__type` |
| 2 | Cut-out subject | `.stage__subject` |
| 3 | Caption card | `.stage__caption` |
| 4 | Navigation | `.nav` |

`.stage` uses a single named grid area (`stack`) that every layer is assigned
to, so they overlap without absolute positioning and the hero still grows with
its content.

### Headline fitting

`script.js` measures the headline at a fixed 200px, then sets an exact pixel
size so the line spans the stage edge to edge. This runs on load, on
`document.fonts.ready`, and via a `ResizeObserver` — so the type always fits
whether or not the webfont loads, and every carousel headline gets sized to the
same width regardless of its length. The CSS `clamp()` is only the pre-JS
fallback.

Note that `.stage` sets `grid-template-columns: minmax(0, 1fr)` and its children
set `min-width: 0`. Without those, the `white-space: nowrap` heading widens its
own grid track, and the measurement chases itself.

## Swapping in the real hero image

`assets/hero-players.svg` is a **placeholder silhouette**. Replace it with the
cut-out of the two players:

1. Cut the subjects out of the source photo and export with a **transparent
   background** — the sky gradient behind them is drawn in CSS, not baked into
   the file.
2. Crop tight to the figures horizontally, and leave generous empty space above
   their heads so the display type reads through behind them. The placeholder's
   `viewBox` (`300 40 800 1170`, roughly a 1:1.46 portrait) is a good target.
3. Save as `assets/hero-players.png` (or `.webp`) and update the `src` on
   `img.stage__subject` in `index.html`, along with its `width`/`height`.

Nothing else needs to change — `object-fit: contain` with
`object-position: bottom center` keeps the figures standing on the bottom edge
at every breakpoint.

## Files

```
index.html   markup
styles.css   all styles, tokens at :root
script.js    hero carousel, headline fitting, mobile nav
assets/      hero subject placeholder + favicon
```

## Type

`Anton` for display, `Inter` for text, both from Google Fonts, with
`Archivo Black` / `Impact` as metric-ish fallbacks for the compressed display
face.
