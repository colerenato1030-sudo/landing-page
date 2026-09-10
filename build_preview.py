#!/usr/bin/env python3
"""Fold index.html, its stylesheet, script and assets into one self-contained
file for publishing as an Artifact.

Artifacts are served as a single document and cannot fetch relative asset
paths, so every local reference has to become a data URI. The site itself
keeps normal separate files — this output is derived, never edited by hand.
"""

import base64
import mimetypes
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "preview.html"


def data_uri(rel: str) -> str:
    path = ROOT / rel
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


def inline_assets(text: str) -> str:
    """Rewrite every assets/… reference, in CSS url() or HTML src, as a data URI."""
    return re.sub(
        r"(?<=['\"(])(assets/[A-Za-z0-9._-]+)(?=['\")])",
        lambda m: data_uri(m.group(1)),
        text,
    )


html = (ROOT / "index.html").read_text()
css = inline_assets((ROOT / "barely-gloss.css").read_text())
js = (ROOT / "barely-gloss.js").read_text()

title = re.search(r"<title>(.*?)</title>", html, re.S).group(1).strip()
fonts = re.search(r'<link rel="stylesheet" href="https://fonts\.googleapis[^>]*>', html).group(0)
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)

body = body.replace('<script src="barely-gloss.js"></script>', "")
body = inline_assets(body)

OUT.write_text(
    f"{fonts}\n<title>{title}</title>\n<style>\n{css}\n</style>\n"
    f"{body}\n<script>\n{js}\n</script>\n"
)
print(f"{OUT.name}: {OUT.stat().st_size / 1024:.0f} KB")
