---
name: fanhub-setup
description: >
  Automatically configures FanHub MCP servers and installs documentation. Runs merge-mcp.js and install-docs.js directly.
  Triggers on: setup fanhub apm, setup fanhub, setup mcp, install documentation, configure mcp servers, fanhub setup, initialize fanhub, setup fanhub workspace.
---

## FanHub Setup Skill

**Purpose**: Automatically configure MCP servers and install FanHub documentation in your workspace.

**What happens when triggered**: The skill runs two setup scripts in sequence:

1. `merge-mcp.js` — Configures MCP servers for FanHub API and databases (dotnet, Node.js, Java, Go)
2. `install-docs.js` — Installs FanHub documentation and architecture guides

## Quick Start

From your project root, run:

```bash
# Step 1: Setup MCP servers
node .github/skills/fanhub-setup/scripts/merge-mcp.js

# Step 2: Install documentation
node .github/skills/fanhub-setup/scripts/install-docs.js
```

Done! Your workspace is now configured with MCP servers and documentation.

## What Gets Configured

### Step 1: Merges MCP Server Configuration

**Script**: `merge-mcp.js`

Safely integrates FanHub MCP servers into your `.vscode/mcp.json` **without destroying existing configurations**:

- ✅ Preserves pre-existing MCP servers you've configured
- ✅ Adds 5 FanHub servers: `fanhub-api`, `fanhub-db-dotnet`, `fanhub-db-node`, `fanhub-db-java`, `fanhub-db-go`
- ✅ Idempotent — safe to run multiple times
- ✅ Works even if `.vscode/mcp.json` doesn't exist yet

### Step 2: Installs Documentation

**Script**: `install-docs.js`

Copies FanHub documentation from the APM package into `fanhubdocs/` at repo root:

- `architecture.md` — Full API reference, models, EF Core setup, seed data
- `breaking-bad-universe.md` — Breaking Bad lore for context

### MCP Servers Configured

| Server             | Purpose                           | Location                                |
| ------------------ | --------------------------------- | --------------------------------------- |
| `fanhub-api`       | REST API queries                  | `localhost:5265` (when backend running) |
| `fanhub-db-dotnet` | SQLite database (C# backend)      | `dotnet/Backend/fanhub.db`              |
| `fanhub-db-node`   | SQLite database (Node.js backend) | `node/Backend/fanhub.db`                |
| `fanhub-db-java`   | SQLite database (Java backend)    | `java/Backend/fanhub.db`                |
| `fanhub-db-go`     | SQLite database (Go backend)      | `go/Backend/fanhub.db`                  |

## Troubleshooting

### Script fails with "mcp-servers.json not found"

**Cause**: APM package not installed

**Fix**:

```bash
apm install MSBart2/apm
node .github/skills/fanhub-setup/scripts/merge-mcp.js
```

### MCP servers not appearing or `.vscode/mcp.json` corrupted

**Fix**:

```bash
rm .vscode/mcp.json
node .github/skills/fanhub-setup/scripts/merge-mcp.js
```

### Documentation failed to install

**Possible causes**: APM package not properly installed or Node.js not available

**Verify and fix**:

```bash
# Verify APM package is installed
ls apm_modules/MSBart2/apm/

# Try manual run
node .github/skills/fanhub-setup/scripts/install-docs.js
```

### Docs don't show in Copilot

Documents are installed to `fanhubdocs/` at the repo root but Copilot may need a reload. Try restarting VS Code or explicitly referencing the docs in your instructions.

## How It Works

**Safe MCP merging**: The `merge-mcp.js` script uses `Object.assign()` to safely merge FanHub servers into `.vscode/mcp.json` while preserving your pre-existing MCP configuration.

**Self-contained deployment**: Both scripts are part of this skill and auto-deployed to `.github/skills/fanhub-setup/` when you run `apm install MSBart2/apm`.
