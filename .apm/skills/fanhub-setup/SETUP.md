# FanHub Setup — Step by Step

You've installed `apm install MSBart2/apm` and now have all the Copilot customization files, including the `fanhub-setup` skill with ready-to-use setup scripts.

## Step 1: Setup MCP Servers

From your project root, run:

```bash
apm run setup-mcp
```

This safely configures FanHub's MCP servers in `.vscode/mcp.json`:
- ✅ Preserves any existing MCP servers you've already configured
- ✅ Adds: `fanhub-api`, `fanhub-db-dotnet`, `fanhub-db-node`, `fanhub-db-java`, `fanhub-db-go`
- ✅ Idempotent — safe to run multiple times
- ✅ Creates `.vscode/` directory if it doesn't exist

## Step 2: Install Documentation

Run:

```bash
apm run install-docs
```

This copies FanHub documentation into `.github/docs/fanhub/`:
- **`architecture.md`** — Full reference: routes, models, EF Core setup, seed data, conventions
- **`breaking-bad-universe.md`** — Breaking Bad lore for context

These documents are now available for Copilot context in your repository.

## Step 3: Compile and Verify

Run:

```bash
apm compile
```

This regenerates `AGENTS.md` and `.claude/instructions.md` to integrate all Copilot customizations. Verify your setup:

## Done!

Your FanHub repo is now fully configured. Open it in VS Code and Copilot will have:
- ✅ Architecture context and conventions in `.github/docs/fanhub/`
- ✅ 6 custom prompts for common tasks
- ✅ 3 reusable skills (including fanhub-setup)
- ✅ 2 agents for complex workflows
- ✅ MCP server access to REST API and language-specific SQLite databases

## Troubleshooting

### `apm run setup-mcp` fails

**Possible causes**:
- `.vscode/mcp.json` is corrupted, or
- The script cannot find `mcp-servers.json` in the package

**Fix**: Delete `.vscode/mcp.json` and re-run:
```bash
rm .vscode/mcp.json
apm run setup-mcp
```

### `apm run install-docs` fails

**Possible causes**:
- Missing `apm_modules/MSBart2/apm/fanhubdocs/` directory, or
- Permission issues creating `.github/docs/fanhub/`

**Fix**: Verify the package is installed and check directory permissions:
```bash
ls -la apm_modules/MSBart2/apm/fanhubdocs/
apm run install-docs
```

### Docs don't show in Copilot

Documents are in `.github/docs/fanhub/` but Copilot may need context. Reference them explicitly or reload VS Code:
```bash
# Restart VS Code to reload context
```

## Design: Self-Contained Skill

This skill (`fanhub-setup`) is self-contained and auto-deployed via APM:

1. **Scripts are part of the skill** — Both `merge-mcp.js` and `install-docs.js` are packaged within `.apm/skills/fanhub-setup/`
2. **APM deploys them automatically** — When you run `apm install MSBart2/apm`, the skill and its scripts land in `.github/skills/fanhub-setup/`
3. **No manual config needed** — The `apm.yml` references them, so `apm run setup-mcp` and `apm run install-docs` work immediately
4. **Safe MCP merging** — Uses `Object.assign()` to preserve your existing `.vscode/mcp.json` configuration

This pattern differs from the old approach (curl + manual script configuration). It's simpler and more maintainable.

See [AGENTS.md](../../../AGENTS.md) for deep context on APM design and limitations.
