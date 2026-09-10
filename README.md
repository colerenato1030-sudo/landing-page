# Barely Gloss

Static site for a nail, lash and spa studio. No build step for the site
itself — open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

| File | Role |
| --- | --- |
| `index.html` | The page |
| `barely-gloss.css` | Design system and all section styles |
| `barely-gloss.js` | Menu panel, treatment filters, banner tabs, quote carousel |
| `build_preview.py` | Folds the above into a single `preview.html` for publishing |
| `acetennis.html` + `styles.css` + `script.js` | Unrelated earlier page, kept intact |

## The hero

The photograph ships as two layers so the wordmark sits *inside* the image
rather than on top of it:

| z-index | Layer |
| --- | --- |
| -3 | Full photograph + scrim (`.hero::before`) |
| -2 | Cool/warm rim light, screen-blended (`.hero::after`) |
| 0 | `.wordmark` |
| 1 | Alpha cutout of hands and silk (`.cutout`) |

Both image layers share `--frame-size` / `--frame-pos` because they must stay
registered to each other; changing one alone will visibly split the hands from
their background. The cutout re-applies the same `--scrim` through its own
alpha so the hands are graded like the frame they came from.

`assets/hero-hands-cut.webp` was derived from `assets/hero-hands-source.png` by
thresholding the subject away from the near-black ground, keeping the largest
connected component and feathering the edge.

## Imagery

Studio photography exists for the four nail treatments only (`treat-*.webp`,
cropped square from the masters in `assets/source/`). Everything else is a
crop of the hero photograph: `card-nails`, `card-lashes`, `card-spa` and
`quote`.

The lash and spa treatment cards therefore still carry drawn motifs, which
is why the menu grid mixes photographs and line art. Shooting those six
services is what closes the gap; the swap is `<div class="treatment-art">`
contents only, nothing else changes.

## Publishing

`preview.html` is generated, gitignored, and should never be hand-edited:

```bash
python3 build_preview.py
```

## Finish photography

The four frames in the finishes band render as CSS lacquer chips — the
finish's own colour under a raking highlight — because the photography has
not landed yet. Each is a `div.finish-frame[data-finish]`. To use a real
photo, swap the div for an image and drop the attribute:

```html
<img class="finish-frame" src="assets/finish-blush.jpg" alt="The palest blush wash, almost bare">
```

`.finish-frame` already carries the aspect ratio, radius and `object-fit`,
so nothing else changes. Removing `data-finish` drops the highlight overlay.
