#!/usr/bin/env node
// Local auto-fallback proxy: tries official provider APIs in order, using
// your own API keys, and moves to the next provider on a rate-limit/quota
// error. No web scraping, no browser-session automation, no TLS spoofing —
// every call is a normal, documented REST request to the provider's own API.
//
// Usage:
//   ANTHROPIC_API_KEY=... OPENAI_API_KEY=... GEMINI_API_KEY=... node server.mjs
//   curl -X POST http://localhost:8787/v1/chat/completions \
//     -H "Content-Type: application/json" \
//     -d '{"messages":[{"role":"user","content":"hello"}]}'

import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "config.json"), "utf8"));
const PORT = process.env.MODEL_FALLBACK_PORT || config.port || 8787;

function isRateLimitOrQuota(status, bodyText) {
  if (status === 429 || status === 529) return true;
  if (status >= 500) return true;
  const t = bodyText.toLowerCase();
  return (
    t.includes("rate_limit") ||
    t.includes("resource_exhausted") ||
    t.includes("quota") ||
    t.includes("overloaded")
  );
}

async function callAnthropic(provider, messages) {
  const apiKey = process.env[provider.apiKeyEnv];
  if (!apiKey) throw { skip: true, reason: `${provider.apiKeyEnv} not set` };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: 4096,
      messages: messages.filter((m) => m.role !== "system"),
      system: messages.find((m) => m.role === "system")?.content,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    if (isRateLimitOrQuota(res.status, text)) throw { skip: true, reason: text };
    throw new Error(`Anthropic error ${res.status}: ${text}`);
  }

  const data = JSON.parse(text);
  return {
    content: data.content.map((c) => c.text ?? "").join(""),
    usage: data.usage,
  };
}

async function callOpenAI(provider, messages) {
  const apiKey = process.env[provider.apiKeyEnv];
  if (!apiKey) throw { skip: true, reason: `${provider.apiKeyEnv} not set` };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: provider.model, messages }),
  });

  const text = await res.text();
  if (!res.ok) {
    if (isRateLimitOrQuota(res.status, text)) throw { skip: true, reason: text };
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }

  const data = JSON.parse(text);
  return {
    content: data.choices[0].message.content,
    usage: data.usage,
  };
}

async function callGemini(provider, messages) {
  const apiKey = process.env[provider.apiKeyEnv];
  if (!apiKey) throw { skip: true, reason: `${provider.apiKeyEnv} not set` };

  const system = messages.find((m) => m.role === "system")?.content;
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents,
      ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    if (isRateLimitOrQuota(res.status, text)) throw { skip: true, reason: text };
    throw new Error(`Gemini error ${res.status}: ${text}`);
  }

  const data = JSON.parse(text);
  const content = data.candidates[0].content.parts.map((p) => p.text ?? "").join("");
  return { content, usage: data.usageMetadata };
}

const CALLERS = { anthropic: callAnthropic, openai: callOpenAI, gemini: callGemini };

async function routeChat(messages) {
  const attempts = [];
  for (const provider of config.providers) {
    const caller = CALLERS[provider.type];
    if (!caller) continue;
    try {
      const result = await caller(provider, messages);
      return { provider: provider.name, model: provider.model, attempts, ...result };
    } catch (err) {
      if (err && err.skip) {
        attempts.push({ provider: provider.name, skipped: true, reason: err.reason });
        continue;
      }
      throw err;
    }
  }
  const err = new Error("All providers exhausted or unavailable");
  err.attempts = attempts;
  throw err;
}

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (req.method === "POST" && req.url === "/v1/chat/completions") {
    let body = "";
    for await (const chunk of req) body += chunk;

    try {
      const { messages } = JSON.parse(body);
      const result = await routeChat(messages);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          id: "fallback-" + Date.now(),
          object: "chat.completion",
          served_by: result.provider,
          model: result.model,
          fallback_attempts: result.attempts,
          choices: [{ index: 0, message: { role: "assistant", content: result.content }, finish_reason: "stop" }],
          usage: result.usage,
        })
      );
    } catch (err) {
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: err.message, attempts: err.attempts || [] }));
    }
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(PORT, () => {
  console.log(`model-fallback proxy listening on http://localhost:${PORT}`);
  console.log(`Provider order: ${config.providers.map((p) => `${p.name}(${p.model})`).join(" -> ")}`);
});
