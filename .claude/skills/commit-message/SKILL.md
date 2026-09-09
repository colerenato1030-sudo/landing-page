---
name: commit-message
description: Draft a git commit message for the currently staged changes in this repo. Use when the user asks to commit, or asks for help writing a commit message.
license: MIT
---

# Commit message

1. Run `git diff --staged` (or `git diff` if nothing is staged) and `git log --oneline -10` to match this repo's existing tone — short, plain-language, no scope prefixes like `feat:`/`fix:`.
2. Summarize the *why*, not a line-by-line list of what changed — the diff already shows what changed.
3. First line: imperative mood, under 70 characters, no trailing period.
4. Body (optional): 1-3 short bullet points only for non-obvious rationale — a bug fix worth explaining, a tradeoff, a constraint that shaped the change. Skip the body entirely for small, self-explanatory changes.
5. Never mention the model, session, or that the commit was AI-assisted inside the commit body — that belongs only in the attribution trailer the harness appends.
