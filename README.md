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

| Module | Type                    | What It Adds                                                                                                                                             |
| ------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01     | Repository instructions | `.github/copilot-instructions.md` — coding conventions, architecture pointers, and bug-fix guidance for FanHub                                           |
| 01     | Architecture doc        | `fanhubdocs/architecture.md` — full reference: routes, models, EF Core setup, seed data, conventions, security notes (via `apm run install-docs`)        |
| 01     | Lore doc                | `fanhubdocs/breaking-bad-universe.md` — Breaking Bad canon reference for skills and agents (via `apm run install-docs`)                                  |
| 03     | Prompts (×6)            | `check-data-accuracy`, `good-idea`, `plan-loreCardAndLorePage`, `prompt-to-skill`, `refresh-docs`, `risk-prioritizer`                                    |
| 04     | Skills (×3)             | `check-data-accuracy`, `lore-accuracy-check`, `new-card-skill` (includes scripts + templates)                                                            |
| 05     | Setup skill & MCP       | `fanhub-setup` skill — Safe merge of MCP servers (fanhub-api, language-track SQLite) + doc deployment via `apm run setup-mcp` and `apm run install-docs` |
| 06     | Agents (×2)             | `scaffold-entity.agent.md`, `plan.agent.md`                                                                                                              |

## Installation

### Prerequisites

- A fork or clone of [FanHub](https://github.com/MSBart2/FanHub)
- GitHub Copilot (Individual, Business, or Enterprise)
- VS Code with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension
- Node.js (for the MCP server and `apm` CLI)

### Install

```bash
# From inside your cloned FanHub repo:
apm install MSBart2/apm        # deploys primitives, prompts, skills, agents, + fanhub-setup skill
node .github/skills/fanhub-setup/scripts/merge-mcp.js    # configures MCP servers
node .github/skills/fanhub-setup/scripts/install-docs.js # installs documentation
apm compile                    # generates AGENTS.md from instructions
```

**Note**: The `merge-mcp.js` and `install-docs.js` scripts are deployed by the `fanhub-setup` skill as part of `apm install`. Just run them directly with Node.js.

The `merge-mcp.js` script safely merges FanHub's MCP server definitions into your existing `.vscode/mcp.json` without overwriting pre-existing servers. See [mcp-servers.json](mcp-servers.json) for the included servers. The `install-docs.js` script copies FanHub documentation to `fanhubdocs/` for Copilot context.

### Uninstall

To completely remove the APM package and all its generated/installed files:

```bash
apm uninstall MSBart2/apm      # removes prompts, agents, skills, instructions from .github/
rm -rf fanhubdocs/             # removes installed docs
apm compile --clean            # removes orphaned AGENTS.md and CLAUDE.md
```

This removes only what APM added:

- Integrated prompt/agent/skill/instruction files from `.github/` (handled by `apm uninstall`)
- Installed documentation files from `fanhubdocs/`
- Compiled `AGENTS.md` and `CLAUDE.md` files

Pre-existing files in your repo are preserved.

### What lands in your FanHub repo

```
fanhub/
├── .github/
│   ├── copilot-instructions.md      ← module 01
│   ├── prompts/                     ← module 03
│   │   ├── check-data-accuracy.prompt.md
│   │   ├── good-idea.prompt.md
│   │   ├── plan-loreCardAndLorePage.prompt.md
│   │   ├── prompt-to-skill.prompt.md
│   │   ├── refresh-docs.prompt.md
│   │   └── risk-prioritizer.prompt.md
│   ├── skills/                      ← module 04 + fanhub-setup
│   │   ├── check-data-accuracy/
│   │   ├── lore-accuracy-check/
│   │   ├── new-card-skill/
│   │   └── fanhub-setup/            ← setup & documentation deployment
│   │       └── scripts/             ← MCP and doc installation scripts
│   │           ├── merge-mcp.js     ← called via apm run setup-mcp
│   │           └── install-docs.js  ← called via apm run install-docs
│   └── agents/                      ← module 06
│       ├── scaffold-entity.agent.md
│       └── plan.agent.md
├── fanhubdocs/                      ← via apm run install-docs
│   ├── architecture.md
│   └── breaking-bad-universe.md
└── .vscode/
    └── mcp.json                     ← wires fanhub-api + fanhub-db MCP servers (via apm run setup-mcp)
```

### After install — configure and start

```bash
# One-time setup after apm install
node .github/skills/fanhub-setup/scripts/merge-mcp.js    # Configure MCP servers
node .github/skills/fanhub-setup/scripts/install-docs.js # Install documentation

# Then start your backend for any language track, e.g. .NET:
cd dotnet/Backend && dotnet run
```

The scripts handle configuration safely:

- `merge-mcp.js` merges FanHub's MCP server definitions into `.vscode/mcp.json` without overwriting pre-existing servers
- `install-docs.js` copies documentation to `fanhubdocs/` for Copilot context

## Workshop Demo (5-minute reveal)

See [WALKTHROUGH.md](WALKTHROUGH.md) for the step-by-step script used to show participants the "after" state at the start of a session — including what Copilot says _before_ and _after_ installing the plugin.

## Relationship to FanHub

FanHub is a Breaking Bad fan site (characters, episodes, quotes, lore) built across four language tracks — Node.js, .NET, Java, Go — with 183+ deliberate bugs. It is designed to be painful to work in _without_ proper Copilot configuration.

This APM repo is the configuration layer that makes Copilot effective inside it. The `.NET` track is the primary target today; other language tracks may get their own packages later.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).
