# Claude Code tooling in this repo

This repo has a few Claude Code-side tools set up. None of them affect the landing page's actual HTML/CSS/JS — they're environment/workflow tools for whoever is developing here with Claude Code.

## Model fallback proxy (`.claude/plugins/model-fallback/`)

A local proxy that auto-switches between AI models when one hits a rate limit — using only official provider APIs and your own API keys. See `.claude/plugins/model-fallback/README.md` for setup and usage.

We looked at the third-party `omniroute` package first, since it advertises the same feature. Its provider list turned out to rely partly on automating ChatGPT/Claude/Grok/Perplexity's *consumer web chat UIs* with spoofed browser fingerprints rather than official APIs, and its own docs list account bans as an expected outcome. We built this instead: same fallback behavior, only calls each provider's real documented API.

## code-reviewer agent + workflow skills (`.claude/agents/`, `.claude/skills/`)

- `code-reviewer` — reviews changes to `index.html`/`styles.css`/`script.js` for accessibility, responsive-layout, and script correctness issues specific to this repo's hero-stack layout.
- `doc-helper`, `pr-description`, `commit-message`, `debugging` — scoped instructions Claude Code loads automatically for those tasks.

## claude-mem (installed at the environment level, not in this repo)

A local memory worker (not committed here — lives in `~/.claude-mem` on whichever machine/container runs it) that lets Claude Code carry context across sessions within a project. Installed with cloud sync explicitly disabled (`--provider claude`, `CLAUDE_MEM_ONLINE_OPTIN=false`) — everything stays local, no account or sign-in required.
