---
name: fanhub-setup
description: >
  Use this skill when setting up a FanHub repository after installing apm MSBart2/apm.
  Configures MCP servers for FanHub API and language-specific databases (dotnet, Node.js, Java, Go),
  and installs FanHub documentation and architecture guides. Triggers on: setup fanhub, setup mcp,
  install documentation, configure mcp servers, fanhub setup, initialize fanhub, setup fanhub workspace.
---

## FanHub Setup Skill

**Purpose**: Set up MCP server configuration and download FanHub documentation for your Copilot customization pack.

**Triggers**: Use this skill when you need to:
- Configure MCP servers for FanHub API and databases (dotnet, Node.js, Java, Go)
- Install FanHub documentation and architecture guides
- Initialize your workspace after installing `apm install MSBart2/apm`

## What This Skill Does

### 1. Merges MCP Server Configuration

**Script**: `merge-mcp.js`

Safely integrates FanHub MCP servers into your `.vscode/mcp.json` **without destroying existing configurations**:

- ✅ Preserves pre-existing MCP servers you've configured
- ✅ Adds 5 FanHub servers: `fanhub-api`, `fanhub-db-dotnet`, `fanhub-db-node`, `fanhub-db-java`, `fanhub-db-go`
- ✅ Idempotent — safe to run multiple times
- ✅ Works even if `.vscode/mcp.json` doesn't exist yet

**When to run**: After installing the package, before starting development.

**Manual invocation**:
```bash
node .github/skills/fanhub-setup/merge-mcp.js
```

### 2. Installs Documentation

**Script**: `install-docs.js`

Copies FanHub documentation from the APM package into `.github/docs/fanhub/`:

- `architecture.md` — Full API reference, models, EF Core setup, seed data
- `breaking-bad-universe.md` — Breaking Bad lore for context

**When to run**: After MCP setup to enable Copilot context on FanHub patterns.

**Manual invocation**:
```bash
node .github/skills/fanhub-setup/install-docs.js
```

## Quick Setup (Recommended Path)

### For APM-Enabled Repos

If your consumer repo has `apm.yml` with scripts already configured:

```bash
# 1. Setup MCP servers
apm run setup-mcp

# 2. Install documentation  
apm run install-docs

# 3. Recompile to integrate all Copilot customizations
apm compile
```

### First-Time Setup: Add Scripts to Your `apm.yml`

If you haven't set up the scripts yet, edit your **consumer repo's `apm.yml`** and add these to the `scripts:` section:

```yaml
scripts:
  setup-mcp: node .github/skills/fanhub-setup/merge-mcp.js
  install-docs: node .github/skills/fanhub-setup/install-docs.js
```

Then run:

```bash
apm run setup-mcp
apm run install-docs
apm compile
```

## What Gets Configured

### MCP Servers Configured

| Server | Purpose | Location |
|--------|---------|----------|
| `fanhub-api` | REST API queries | `localhost:5265` (when backend running) |
| `fanhub-db-dotnet` | SQLite database (C# backend) | `dotnet/Backend/fanhub.db` |
| `fanhub-db-node` | SQLite database (Node.js backend) | `node/Backend/fanhub.db` |
| `fanhub-db-java` | SQLite database (Java backend) | `java/Backend/fanhub.db` |
| `fanhub-db-go` | SQLite database (Go backend) | `go/Backend/fanhub.db` |

### Documentation Installed

**Location**: `.github/docs/fanhub/`

- `architecture.md` — EF Core models, entity relationships, seed data structure, API conventions
- `breaking-bad-universe.md` — Breaking Bad context for realistic test data

## Troubleshooting

### "Script not found" error

**Cause**: Scripts not configured in your `apm.yml`

**Fix**: Follow "First-Time Setup" section above to add scripts to your consumer repo's `apm.yml`.

### MCP servers not appearing in Copilot

**Cause**: `.vscode/mcp.json` corrupted or `merge-mcp.js` failed

**Fix**:
```bash
# Delete corrupted config
rm .vscode/mcp.json

# Re-run merge (creates fresh config)
node .github/skills/fanhub-setup/merge-mcp.js
```

### Documentation failed to install

**Cause**: APM package not properly installed or Node.js not available

**Check**:
```bash
# Verify package installed
ls apm_modules/MSBart2/apm/fanhubdocs/

# Try manual run with verbose output
node .github/skills/fanhub-setup/install-docs.js
```

## How It Works

**Why scripts aren't auto-deployed by APM**:

APM automatically deploys `.instructions.md`, `.prompt.md`, `.skill.md`, and `.agent.md` files to `.github/`, but custom scripts must be explicitly configured in your `apm.yml`. This is intentional — it gives you control over which utilities you enable and how they're invoked.

**Safe MCP merging**:

APM's native `dependencies.mcp` configuration **overwrites** the entire `.vscode/mcp.json` file. The `merge-mcp.js` script instead uses `Object.assign()` to safely merge FanHub servers while preserving your pre-existing MCP configuration.

## See Also

- [SETUP.md](./../fanhub-setup/SETUP.md) — Step-by-step walkthrough
- [../../../AGENTS.md](../../../AGENTS.md) — Deep context on APM design and limitations
- [../../../apm.yml](../../../apm.yml) — Package configuration
