# Model Fallback Proxy

A small local proxy that auto-switches between AI models when one hits a rate limit or quota error — using only official provider APIs and your own API keys. No web scraping, no browser-session automation, no TLS fingerprint spoofing.

## Why this exists instead of a "352 provider" router

We looked at `omniroute` (the tool that inspired this) and found that a meaningful part of its provider list works by automating the *consumer web chat UIs* of ChatGPT, Claude, Grok, Perplexity, and LMArena — spoofing browser TLS fingerprints to make those sites' web sessions look like an API. Its own docs list "banned" as an expected outcome for those connections. That's not something we could safely set up for you.

This proxy does the same *useful* thing — stop getting blocked by one provider's rate limit — the boring, legitimate way: call each provider's real, documented API with a key you own, and fall through to the next one on a 429/quota error.

## Setup

```bash
export ANTHROPIC_API_KEY="sk-ant-..."   # optional but recommended — tried first
export OPENAI_API_KEY="sk-..."          # optional — first fallback
export GEMINI_API_KEY="..."             # optional — second fallback

node .claude/plugins/model-fallback/server.mjs
```

Any provider whose API key isn't set is skipped automatically — you don't need all three.

## Usage

```bash
curl -X POST http://localhost:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hello"}]}'
```

Response includes which provider actually served the request and what was tried before it:

```json
{
  "served_by": "anthropic-sonnet",
  "model": "claude-sonnet-4-5-20250929",
  "fallback_attempts": [],
  "choices": [{ "message": { "role": "assistant", "content": "..." } }]
}
```

If Anthropic is rate-limited, `fallback_attempts` shows it was skipped and `served_by` shows whichever provider actually answered.

## Changing the provider order or models

Edit `config.json` — it's a plain ordered list, first entry tried first:

```json
{ "name": "anthropic-sonnet", "type": "anthropic", "model": "claude-sonnet-4-5-20250929", "apiKeyEnv": "ANTHROPIC_API_KEY" }
```

`type` must be one of `anthropic`, `openai`, `gemini` — those are the three official APIs currently implemented in `server.mjs`.

## Limitations

- No streaming support (returns the full response at once).
- Only text messages — no images/tool calls yet.
- This is a local proxy for your own use; it's not wired into Claude Code itself or into the landing page's frontend.
