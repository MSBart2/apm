# FanHub APM — Guide for AI Agents

This repo is an [Agent Package Manager](https://microsoft.github.io/apm/) (APM) distribution of GitHub Copilot customization assets for the [FanHub](https://github.com/MSBart2/FanHub) workshop.

## What APM Does

APM is a package manager that distributes Copilot customization files into target repositories. When you run `apm install MSBart2/apm` in a FanHub fork:

1. APM clones this repo into `apm_modules/MSBart2/apm/`
2. APM discovers and deploys all files in `.apm/` subdirectories to the target repo
3. Scripts (if distributed) can be called with `apm run <script-name>`

## Codebase Structure

```
apm/
├── .apm/                           # ← APM-recognized asset directories
│   ├── instructions/
│   │   └── workshop.instructions.md    # Main Copilot instructions
│   ├── prompts/                        # 6 custom prompts
│   ├── skills/                         # 3 reusable skills + fanhub-setup
│   │   ├── check-data-accuracy/
│   │   ├── create-card-and-page/
│   │   └── fanhub-setup/              # ← Setup skill with MCP & docs scripts
│   │       ├── scripts/
│   │       │   ├── merge-mcp.js
│   │       │   └── install-docs.js
│   │       └── SKILL.md
│   └── agents/                         # 2 custom agents
├── mcp-servers.json               # MCP server definitions (read by merge-mcp.js)
├── fanhubdocs/                    # ← Documentation included in package
│   ├── architecture.md
│   └── breaking-bad-universe.md
├── apm.yml                         # ← Package manifest (YAML)
├── README.md                       # User-facing installation guide
├── CONTRIBUTING.md                # Asset contribution guidelines
└── AGENTS.md                       # ← This file
```

## APM Naming Convention

Files must follow strict naming patterns to be recognized and deployed:

| Pattern            | Deployed To             | Loaded As               | Example                         |
| ------------------ | ----------------------- | ----------------------- | ------------------------------- |
| `.instructions.md` | `.github/instructions/` | Repository instructions | `workshop.instructions.md`      |
| `.prompt.md`       | `.github/prompts/`      | Named prompts           | `check-data-accuracy.prompt.md` |
| `.skill.md`        | `.github/skills/`       | Skill definitions       | `refactor-skill.skill.md`       |
| `.agent.md`        | `.github/agents/`       | Agent definitions       | `plan.agent.md`                 |

**Critical rule**: Files outside `.apm/` subdirectories are NOT automatically deployed by APM. Only files in `.apm/{instructions,prompts,skills,agents}/` are recognized.

## Key Components

### Scripts in Skills

Starting with the `fanhub-setup` skill, setup utilities are now packaged as part of skills instead of in a top-level `scripts/` directory. This keeps related functionality together and ensures scripts are automatically deployed when the skill is installed.

### `fanhub-setup` Skill

The `.apm/skills/fanhub-setup/` directory contains two critical scripts:

#### `merge-mcp.js` (CRITICAL)

**Purpose**: Safely merges FanHub MCP servers into `.vscode/mcp.json` without overwriting pre-existing servers.

**Why it exists**: APM's native `dependencies.mcp` in `apm.yml` **overwrites** the entire `.vscode/mcp.json` file, destroying any pre-existing MCP configurations. This script performs a safe merge instead.

**How it works**:

1. Reads `mcp-servers.json` (all FanHub MCP server definitions)
2. Reads existing `.vscode/mcp.json` (if exists)
3. Merges FanHub servers using `Object.assign()` (preserves pre-existing servers)
4. Writes merged config back

**Called via**: `apm run setup-mcp` (defined in `apm.yml`)

**Deployed to**: `.github/skills/fanhub-setup/scripts/merge-mcp.js` (when consumer runs `apm install`)

#### `install-docs.js`

**Purpose**: Copies FanHub documentation from the package into the consumer repo.

**How it works**:

1. Reads documentation files from `apm_modules/MSBart2/apm/fanhubdocs/`
2. Creates `.github/docs/fanhub/` directory
3. Copies all documentation files for Copilot context

**Called via**: `apm run install-docs` (defined in `apm.yml`)

**Deployed to**: `.github/skills/fanhub-setup/scripts/install-docs.js` (when consumer runs `apm install`)

### `mcp-servers.json`

JSON object with all 5 FanHub MCP server definitions:

- `fanhub-api` — REST API endpoint (localhost:5265)
- `fanhub-db-dotnet` — SQLite access to dotnet/Backend/fanhub.db
- `fanhub-db-node` — SQLite access to node/Backend/fanhub.db
- `fanhub-db-java` — SQLite access to java/Backend/fanhub.db
- `fanhub-db-go` — SQLite access to go/Backend/fanhub.db

Read by `merge-mcp.js`; never modify directly unless adding/removing servers.

## `apm.yml` Manifest

Controls what APM does when installing:

```yaml
name: fanhub-workshop # Package name (for apm install MSBart2/apm)
version: 1.0.0 # Semantic versioning
target: all # Deploy to all language tracks
scripts: # Scripts callable via apm run <name>
  setup-mcp: node ${workspaceFolder}/.github/skills/fanhub-setup/scripts/merge-mcp.js # Merges MCP config safely
  install-docs: node ${workspaceFolder}/.github/skills/fanhub-setup/scripts/install-docs.js # Installs docs to consumer repo
  uninstall-docs: 'node -e "const fs=require(''fs'');const p=require(''path'');..."' # Removes docs directory
dependencies:
  apm: [] # No APM dependencies
  mcp: [] # Empty (MCP handled via setup-mcp script)
```

## Common Tasks

### Adding a New Copilot Customization

1. **Create the file** in the correct `.apm/` subdirectory with the correct suffix:

   ```bash
   echo "# New Prompt\n..." > .apm/prompts/my-new-prompt.prompt.md
   ```

2. **Update README.md** — Add a row to the "What's Included" table

3. **Test locally** (if possible):
   ```bash
   cd ~/FanHub-1
   apm install MSBart2/apm
   apm compile
   # Verify the file appears in .github/
   ```

### Updating the MCP Configuration

1. Edit `mcp-servers.json` to add/remove/modify server definitions
2. Commit: `git add mcp-servers.json && git commit -m "feat: update MCP servers"`
3. When consumers run `apm run setup-mcp`, their `.vscode/mcp.json` is updated on next install

### Deploying Utility Scripts

**Updated Pattern**: Scripts are now packaged within skills (e.g., `.apm/skills/fanhub-setup/merge-mcp.js`) rather than in a top-level `scripts/` directory.

**How it works**:

1. **Store scripts inside a skill's `scripts/` directory** — e.g., `.apm/skills/fanhub-setup/scripts/merge-mcp.js`
2. **APM deploys the entire skill** — Scripts land in `.github/skills/<skill-name>/scripts/` when `apm install` runs
3. **Reference in `apm.yml`** — Use the deployed path: `node ${workspaceFolder}/.github/skills/fanhub-setup/scripts/merge-mcp.js`
4. **Make scripts executable** — Mark them with `#!/usr/bin/env node` shebang (Node.js scripts)
5. **Keep scripts cross-platform** — Prefer Node.js over shell for portability

**Benefits**:

- ✅ Scripts stay versioned with the skill
- ✅ Related functionality is organized together
- ✅ Scripts are auto-deployed when the skill is installed
- ✅ Full control over execution and error handling
- ✅ Works across Windows, macOS, and Linux

**See also**: [fanhub-setup Skill](./apm/skills/fanhub-setup/SKILL.md) — example of a skill with integrated scripts.

### The Script Discovery Problem

This approach has a fundamental friction point: **consumers don't automatically know which scripts they need to add to their `apm.yml`**. When they run `apm install MSBart2/apm`, APM does NOT:

- Auto-populate the consumer's `scripts:` section with the package's utilities
- Display setup instructions
- Support post-install hooks that automatically execute scripts (hooks are JSON configurations, not automation triggers)
- Make utilities discoverable via `apm_modules/`

**Result**: Users must read the README to know what to do. If they skip that step, `apm run install-docs` and `apm run setup-mcp` fail with "script not found" errors.

**APM Hook Architecture** (verified from official docs):

- APM supports "hooks" as a primitive type (JSON configuration files)
- Hooks deploy to `.github/hooks/*.json`, `.claude/settings.json`, `.cursor/hooks.json`
- **Hooks are configuration files, not executable automation triggers**
- They don't support automatic script execution on install (no post-install hook mechanism as of April 2026)
- See https://microsoft.github.io/apm/reference/cli-commands/ for `apm install` hooks deployment

**Potential solutions** (if APM adds post-install automation in the future):

1. APM **post-install hooks** (not yet documented or available)
2. Create a `.apm/hooks/` directory with post-install automation files (not a recognized pattern yet)
3. Document this prominently in README and accept the friction as a current APM limitation

See [References](#references) → Official APM Documentation for the latest on hooks support.

## Known Constraints & Gotchas

### 1. Scripts Don't Auto-Inherit from Dependencies

APM packages don't automatically forward their `scripts:` section to consumers. Consumers must explicitly define script references in their own `apm.yml` to call the package's utilities. This is by design — it gives consumers control over which utilities they enable.

**Mitigation**: Clearly document in README which scripts consumers should add and the exact definitions to use.

### 2. MCP Overwrite Risk

Never use APM's native `dependencies.mcp` array in `apm.yml` for MCP servers — it overwrites `.vscode/mcp.json` entirely. Always use a merge script instead.

### 3. YAML Syntax

Complex nested quotes in YAML must be carefully escaped. Use simple, minimal quotes:

- ✅ `"curl ... && curl ..."` (simple strings)
- ❌ `'node -e "const fs=require(\'fs\'); ..."'` (triple-nested quotes → parse errors)

### 4. File Paths

- Docs must go in `fanhubdocs/` (not `dotnet/docs/`) to avoid conflicts with FanHub's own docs
- Scripts must be cross-platform (Node.js preferred over PowerShell)
- Reference scripts via relative paths from consumer repos: `apm_modules/MSBart2/apm/scripts/script.js`

## Development Workflow

```bash
# 1. Make changes (add/update files in .apm/ or scripts/)
git add .apm/ scripts/ apm.yml README.md
git commit -m "feat: add new prompt" -m "Adds X prompt for Y use case"
git push

# 2. Test in consumer repo
cd ~/FanHub-1
apm install MSBart2/apm
apm run install-docs
apm run setup-mcp
apm compile

# 3. Verify files landed correctly
ls .github/prompts/          # Should include your new prompt
cat .vscode/mcp.json | grep fanhub-api  # Should see MCP servers
```

## References

- **Official APM Documentation**: https://microsoft.github.io/apm/ — Authoritative guide for APM behavior, script distribution, and package configuration
- [README.md](README.md) — User-facing installation guide
- [CONTRIBUTING.md](CONTRIBUTING.md) — Asset contribution guidelines
- [mcp-servers.json](mcp-servers.json) — MCP server definitions
- [scripts/merge-mcp.js](scripts/merge-mcp.js) — Safe MCP merge utility
