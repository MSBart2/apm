# FanHub APM — Agent Package Manager

A package manager for GitHub Copilot customization assets that installs into the [FanHub](https://github.com/MSBart2/FanHub) workshop repository.

## What Is This?

[FanHub](https://github.com/MSBart2/FanHub) ships intentionally broken and unconfigured — that's the point. During the [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop), participants build every Copilot customization artifact (instructions, prompts, skills, agents, MCP servers) from scratch across modules 01–06. **This repo contains the finished versions of all those artifacts**, packaged so they can be installed in one command.

Use it to:

- **Demo the "after" state** at the start of a workshop — install everything, show Copilot working brilliantly, then uninstall and have participants rebuild it piece by piece
- **Get unstuck** — reference or cherry-pick individual files mid-workshop
- **Bootstrap a new FanHub fork** — skip the build-from-scratch phase and go straight to feature work

## What's Included

This repo **is** the package — a complete Copilot AI layer for FanHub's `.NET` track (ASP.NET Core + Blazor + SQLite).

| Module | Type                    | What It Adds                                                                                                                                                 |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 01     | Repository instructions | `.github/copilot-instructions.md` — coding conventions, architecture pointers, and bug-fix guidance scoped to the `dotnet/` track                            |
| 01     | Architecture doc        | `docs/architecture.md` — full reference: routes, models, EF Core setup, seed data, conventions, security notes (deployed via `apm run install-docs`)         |
| 01     | Lore doc                | `docs/breaking-bad-universe.md` — Breaking Bad canon reference for skills and agents (deployed via `apm run install-docs`)                                   |
| 03     | Prompts (×6)            | `check-data-accuracy`, `good-idea`, `plan-loreCardAndLorePage`, `prompt-to-skill`, `refresh-docs`, `risk-prioritizer`                                        |
| 04     | Skills (×3)             | `check-data-accuracy`, `lore-accuracy-check`, `new-card-skill` (includes scripts + templates)                                                                |
| 05     | MCP server              | `mcp-servers/fanhub-api-server.js` — exposes FanHub's REST API to Copilot Chat; `.vscode/mcp.json` wires it up alongside `mcp-sqlite` pointed at `fanhub.db` |
| 06     | Agents (×2)             | `scaffold-entity.agent.md`, `plan.agent.md`                                                                                                                  |

## Installation

### Prerequisites

- A fork or clone of [FanHub](https://github.com/MSBart2/FanHub)
- GitHub Copilot (Individual, Business, or Enterprise)
- VS Code with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension
- Node.js (for the MCP server and `apm` CLI)

### Install

```bash
# From inside your cloned FanHub repo:
apm install MSBart2/apm
```

This deploys all primitives from `.apm/` into the correct locations in your FanHub repo and writes `apm.lock.yaml` so every developer gets an identical configuration.

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
│   ├── skills/                      ← module 04
│   │   ├── check-data-accuracy/
│   │   ├── lore-accuracy-check/
│   │   └── new-card-skill/
│   └── agents/                      ← module 06
│       ├── scaffold-entity.agent.md
│       └── plan.agent.md
├── docs/
│   ├── architecture.md              ← module 01, read automatically by Copilot
│   └── breaking-bad-universe.md     ← lore reference for skills
├── mcp-servers/
│   └── fanhub-api-server.js         ← module 05
└── .vscode/
    └── mcp.json                     ← wires fanhub-api + fanhub-db MCP servers
```

### After install — start the MCP server

The MCP server requires the FanHub backend to be running first:

```bash
# Terminal 1 — FanHub backend (dotnet track)
cd dotnet/Backend && dotnet run

# Terminal 2 — MCP server
node mcp-servers/fanhub-api-server.js
```

`mcp.json` also wires up `mcp-sqlite` pointing at `dotnet/Backend/fanhub.db` for direct database queries through Copilot Chat.

## Workshop Demo (5-minute reveal)

See [WALKTHROUGH.md](WALKTHROUGH.md) for the step-by-step script used to show participants the "after" state at the start of a session — including what Copilot says _before_ and _after_ installing the plugin.

## Relationship to FanHub

FanHub is a Breaking Bad fan site (characters, episodes, quotes, lore) built across four language tracks — Node.js, .NET, Java, Go — with 183+ deliberate bugs. It is designed to be painful to work in _without_ proper Copilot configuration.

This APM repo is the configuration layer that makes Copilot effective inside it. The `.NET` track is the primary target today; other language tracks may get their own packages later.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).
