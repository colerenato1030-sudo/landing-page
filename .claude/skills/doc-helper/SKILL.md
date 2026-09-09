---
name: doc-helper
description: Keep README.md in sync after structural changes to this landing page (new sections, new files, changed hero layers). Use after adding/removing a section, file, or changing how the hero carousel or headline-fit works.
license: MIT
---

# Doc helper

`README.md` documents three things for this repo — keep each current after a relevant change:

1. **The hero's layer table** (z-index → layer → element) — update it if a layer is added, removed, or reordered in `index.html`'s `.stage`.
2. **The `Files` section** — update it if a top-level file is added or removed.
3. **The hero-image swap instructions** — update them if `assets/hero-players.svg` is replaced or the `img.stage__subject` markup changes shape.

Don't add new documentation sections speculatively — only update what the change actually touched. Match the existing terse, instructional tone (no marketing language, no restating what the code obviously does).
