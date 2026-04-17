# Changelog

All notable changes to this project will be documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Initial repository scaffold (README, CONTRIBUTING, CHANGELOG, .gitignore, LICENSE)
- `fanhub-workshop` v1.0.0 — complete APM package for the FanHub `.NET` Breaking Bad workshop track
  - Standard APM layout: all primitives in `.apm/`, large reference docs in `docs/`
  - Module 01: `.apm/instructions/copilot-instructions.instructions.md` (compiled into `AGENTS.md`/`CLAUDE.md` via `apm compile`)
  - Module 01: `docs/architecture.md` + `docs/breaking-bad-universe.md` (deployed via `apm run install-docs` — kept out of compiled context to avoid token bloat)
  - Module 03: 6 prompts — `check-data-accuracy`, `good-idea`, `plan-loreCardAndLorePage`, `prompt-to-skill`, `refresh-docs`, `risk-prioritizer`
  - Module 04: 3 skills — `check-data-accuracy`, `lore-accuracy-check`, `new-card-skill` (with scripts + templates)
  - Module 05: `mcp-servers/fanhub-api-server.js` + MCP dependency config (fanhub-api stdio + mcp-sqlite)
  - Module 06: 2 agents — `scaffold-entity`, `plan`
  - `WALKTHROUGH.md` — 5-minute facilitator demo script
  - `target: all` — `apm compile` generates both `AGENTS.md` and `CLAUDE.md`
