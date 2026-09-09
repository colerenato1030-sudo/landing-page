# Graph Report - landing-page  (2026-09-09)

## Corpus Check
- 20 files · ~10,879 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 112 nodes · 111 edges · 17 communities (12 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `80522364`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Graphify
- Graphify Install Matrix
- server.mjs
- Build and Fallback Recipes
- Graphify CLI Command Map
- Instructions
- Mode Packets and Route-outs
- patch_wikilink.py
- Model Fallback Proxy
- AceTennis — landing page
- Claude Code tooling in this repo
- script.js
- commit-message/SKILL.md
- debugging/SKILL.md
- doc-helper/SKILL.md
- pr-description/SKILL.md

## God Nodes (most connected - your core abstractions)
1. `Graphify` - 10 edges
2. `Build and Fallback Recipes` - 10 edges
3. `Graphify CLI Command Map` - 10 edges
4. `Instructions` - 9 edges
5. `Mode Packets and Route-outs` - 8 edges
6. `Model Fallback Proxy` - 6 edges
7. `Examples` - 6 edges
8. `Graphify Install Matrix` - 6 edges
9. `AceTennis — landing page` - 5 edges
10. `isRateLimitOrQuota()` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (17 total, 4 thin omitted)

### Community 0 - "Graphify"
Cohesion: 0.14
Nodes (14): Best practices, CLI quickstart, Example 1: understand a repo before editing, Example 2: trace a relationship from an existing graph, Example 3: review a diff, Example 4: install for our agents, Example 5: request is really search, Examples (+6 more)

### Community 1 - "Graphify Install Matrix"
Cohesion: 0.18
Nodes (6): Graphify Install Matrix, `graphify install` platform ids, jeo · jeopi · gjc — install via the shared `~/.agents/skills` root, opencode — two products, one binary name, Recommended order for a fresh machine, Uninstall

### Community 2 - "server.mjs"
Cohesion: 0.29
Nodes (9): callAnthropic(), CALLERS, callGemini(), callOpenAI(), config, __dirname, isRateLimitOrQuota(), routeChat() (+1 more)

### Community 3 - "Build and Fallback Recipes"
Cohesion: 0.20
Nodes (10): `assistant-native-install`, Build and Fallback Recipes, Common failure patterns, Core runtime facts, `graph-query-followup`, `incremental-refresh`, `local-python-build`, Neighboring ownership reminder (+2 more)

### Community 4 - "Graphify CLI Command Map"
Cohesion: 0.20
Nodes (10): 1. Build and refresh, 2. Query and navigate, 3. Export, 4. Keep it fresh automatically, 5. Change-aware review (CI and PR work), 6. Serve the graph to an agent, 7. Ingest external material, 8. State and migration (+2 more)

### Community 5 - "Instructions"
Cohesion: 0.22
Nodes (9): Instructions, Step 1: Normalize the request into one packet, Step 2: Pick one CLI mode, Step 3: Scope before spending, Step 4: Run the narrowest command set, Step 5: Report degraded output honestly, Step 6: Read artifacts in order, Step 7: Route adjacent work outward (+1 more)

### Community 6 - "Mode Packets and Route-outs"
Cohesion: 0.25
Nodes (8): `assistant-install-packet`, `mixed-corpus-memory-packet`, Mode Packets and Route-outs, Quick route-out table, `refresh-or-fallback-packet`, `relationship-trace-packet`, `repo-structure-packet`, Rule of thumb

### Community 7 - "patch_wikilink.py"
Cohesion: 0.43
Nodes (7): locate_wiki_py(), main(), patch_file(), Re-apply graphify's wikilink normalization to the installed wiki.py. Why this…, Return (patched_source, n_links_rewritten). Rewrites every raw-label wikilink…, self_test(), transform()

### Community 8 - "Model Fallback Proxy"
Cohesion: 0.29
Nodes (6): Changing the provider order or models, Limitations, Model Fallback Proxy, Setup, Usage, Why this exists instead of a "352 provider" router

### Community 9 - "AceTennis — landing page"
Cohesion: 0.29
Nodes (6): AceTennis — landing page, Files, Headline fitting, Swapping in the real hero image, The hero, Type

### Community 10 - "Claude Code tooling in this repo"
Cohesion: 0.40
Nodes (4): Claude Code tooling in this repo, claude-mem (installed at the environment level, not in this repo), code-reviewer agent + workflow skills (`.claude/agents/`, `.claude/skills/`), Model fallback proxy (`.claude/plugins/model-fallback/`)

### Community 11 - "script.js"
Cohesion: 0.83
Nodes (3): fit(), go(), render()

## Knowledge Gaps
- **69 isolated node(s):** `__dirname`, `config`, `CALLERS`, `Model fallback proxy (`.claude/plugins/model-fallback/`)`, `code-reviewer agent + workflow skills (`.claude/agents/`, `.claude/skills/`)` (+64 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 79 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Graphify` connect `Graphify` to `Graphify Install Matrix`, `Instructions`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `Build and Fallback Recipes` connect `Build and Fallback Recipes` to `Graphify Install Matrix`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `Graphify CLI Command Map` connect `Graphify CLI Command Map` to `Graphify Install Matrix`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `__dirname`, `config`, `CALLERS` to the rest of the system?**
  _69 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Graphify` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._