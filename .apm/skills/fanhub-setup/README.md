# FanHub Setup Skill

Complete setup for FanHub APM package installation and MCP configuration.

## What This Skill Does

This skill automates the final setup steps after `apm install MSBart2/apm`:

1. **Download Documentation** — Fetches architecture and lore documentation from the GitHub repo
2. **Merge MCP Servers** — Safely integrates FanHub MCP servers into `.vscode/mcp.json` without overwriting existing configs

## Files

- **`SETUP.md`** — Step-by-step instructions (start here!)
- **`merge-mcp.js`** — Merges FanHub MCP servers safely
- **`install-docs.js`** — Downloads documentation files

## Quick Start

After running `apm install MSBart2/apm`, follow the steps in [SETUP.md](SETUP.md) to complete the configuration.

## Why Is This Needed?

APM auto-deploys instructions, prompts, agents, and skills, but scripts must be manually wired into your `apm.yml` because APM doesn't auto-inherit scripts from dependencies (by design).

This skill makes it easy: just follow the setup guide, copy-paste the configuration, and run two commands.
