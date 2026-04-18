# FanHub APM — Agent Package Manager

A package manager for GitHub Copilot customization assets that installs into the [FanHub](https://github.com/MSBart2/FanHub) workshop repository.

## What Is This?

[FanHub](https://github.com/MSBart2/FanHub) ships intentionally broken and unconfigured — that's the point. During the [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop), participants build every Copilot customization artifact (instructions, prompts, skills, agents, MCP servers) from scratch across modules 01–06. **This repo contains the finished versions of all those artifacts**, packaged so they can be installed in one command.

Use it to:

- **Demo the "after" state** at the start of a workshop — install everything, show Copilot working brilliantly, then uninstall and have participants rebuild it piece by piece
- **Get unstuck** — reference or cherry-pick individual files mid-workshop
- **Bootstrap a new FanHub fork** — skip the build-from-scratch phase and go straight to feature work

## What's Included

This repo **is** the package — a complete Copilot AI layer for FanHub's all four language tracks (Node.js, `.NET`, Java, Go). Includes shared instructions, prompts, skills, agents, REST API access, and database connectivity via MCP servers.

| Module | Type                    | What It Adds                                                                                                                                                            |
| ------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01     | Repository instructions | `.github/copilot-instructions.md` — coding conventions, architecture pointers, and bug-fix guidance for FanHub (deployed via `apm run install-docs`) |
| 01     | Architecture doc        | `fanhubapm/architecture.md` — full reference: routes, models, EF Core setup, seed data, conventions, security notes (deployed via `apm run install-docs`)               |
| 01     | Lore doc                | `fanhubapm/breaking-bad-universe.md` — Breaking Bad canon reference for skills and agents (deployed via `apm run install-docs`)                                         |
| 03     | Prompts (×6)            | `check-data-accuracy`, `good-idea`, `plan-loreCardAndLorePage`, `prompt-to-skill`, `refresh-docs`, `risk-prioritizer`                                                   |
| 04     | Skills (×3)             | `check-data-accuracy`, `lore-accuracy-check`, `new-card-skill` (includes scripts + templates)                                                                           |
| 05     | MCP servers             | `fanhub-api-server.js` — REST API (all tracks); `mcp-sqlite` database access for all 4 language tracks (Node.js, .NET, Java, Go) via `.vscode/mcp.json`              |
| 06     | Agents (×2)             | `scaffold-entity.agent.md`, `plan.agent.md`                                                                                                                             |

## Installation

### Prerequisites

- A fork or clone of [FanHub](https://github.com/MSBart2/FanHub)
- GitHub Copilot (Individual, Business, or Enterprise)
- VS Code with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension
- Node.js (for the MCP server and `apm` CLI)

### Install

```bash
# From inside your cloned FanHub repo:
apm install MSBart2/apm   # deploys primitives + MCP servers + scripts
apm run install-docs      # downloads architecture.md + breaking-bad-universe.md + copilot-instructions.md
apm compile               # generates AGENTS.md + CLAUDE.md from instructions
```

When you install `MSBart2/apm`, the package includes the `install-docs` and `uninstall-docs` scripts in its own `apm.yml`. APM automatically merges these into your project's `apm.yml` during the install step, so they're immediately available to run.

### Uninstall

To completely remove the APM package and all its generated/downloaded files:

```bash
apm uninstall MSBart2/apm    # removes prompts, agents, skills, instructions from .github/
apm run uninstall-docs       # removes downloaded docs (architecture.md, breaking-bad-universe.md, copilot-instructions.md)
apm compile --clean          # removes orphaned AGENTS.md and CLAUDE.md
```

This removes only what APM added:

- Integrated prompt/agent/skill/instruction files from `.github/`
- Downloaded documentation files from `fanhubapm/` and `.github/`
- Compiled `AGENTS.md` and `CLAUDE.md` files

Pre-existing files in your repo are preserved.

### What lands in your FanHub repo

```
fanhub/
├── .github/
│   ├── copilot-instructions.md      ← module 01 (via apm run install-docs)
│   ├── prompts/                     ← module 03
│   │   ├── check-data-accuracy.prompt.md
│   │   ├── good-idea.prompt.md
│   │   ├── plan-loreCardAndLorePage.prompt.md
│   │   ├── prompt-to-skill.prompt.md
│   │   ├── refresh-docs.prompt.md
│   │   └── risk-prioritizer.prompt.md
│   ├── skills/                      ← module 04
│   │   ├── check-data-accuracy/
│   │   ├── lore-accuracy-check/
│   │   └── new-card-skill/
│   └── agents/                      ← module 06
│       ├── scaffold-entity.agent.md
│       └── plan.agent.md
├── fanhubapm/
│   ├── architecture.md              ← via apm run install-docs
│   └── breaking-bad-universe.md     ← via apm run install-docs
├── mcp-servers/
│   └── fanhub-api-server.js         ← module 05
└── .vscode/
    └── mcp.json                     ← wires fanhub-api + fanhub-db MCP servers
```

### After install — start MCP servers

To use MCP servers, start the backend for your language track. For example, `.NET`:

```bash
# Terminal 1 — FanHub backend (.NET track)
cd dotnet/Backend && dotnet run

# Terminal 2 — MCP server (optional; mcp.json auto-wires fanhub-api + language-specific SQLite)
node mcp-servers/fanhub-api-server.js
```

`.vscode/mcp.json` auto-wires:
- `fanhub-api-server.js` — REST API access (all tracks)
- `mcp-sqlite` — Direct database queries for whichever track you're using (Node.js, .NET, Java, or Go)

## Workshop Demo (5-minute reveal)

See [WALKTHROUGH.md](WALKTHROUGH.md) for the step-by-step script used to show participants the "after" state at the start of a session — including what Copilot says _before_ and _after_ installing the plugin.

## Relationship to FanHub

FanHub is a Breaking Bad fan site (characters, episodes, quotes, lore) built across four language tracks — Node.js, .NET, Java, Go — with 183+ deliberate bugs. It is designed to be painful to work in _without_ proper Copilot configuration.

This APM repo is the configuration layer that makes Copilot effective inside it. The `.NET` track is the primary target today; other language tracks may get their own packages later.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).
