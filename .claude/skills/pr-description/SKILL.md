---
name: pr-description
description: Draft a pull request title and description for this repo's changes. Use when the user asks to open a PR or wants help describing one.
license: MIT
---

# PR description

1. Run `git log --oneline <base>..HEAD` and `git diff <base>...HEAD` to see every commit going into the PR, not just the latest one.
2. Check for a PR template in `.github/pull_request_template.md` or similar; if present, populate its sections instead of inventing a new structure.
3. If no template exists, use:
   - **Summary** — 1-3 bullet points on what changed and why, aimed at someone who hasn't seen the diff.
   - **Test plan** — a checklist of what was verified (e.g. "checked at 320/390/768/1024/1440px in Chromium", "ran through the hero carousel keyboard controls").
4. Title: under 70 characters, describes the outcome, not the mechanism ("Fix nav menu closing on link click" not "Update script.js").
5. Never invent a test plan item that wasn't actually verified.
