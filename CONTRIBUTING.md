# Contributing to FanHub APM

Thanks for helping grow the package! Contributions are welcome — new assets, improvements to existing ones, and documentation fixes are all appreciated.

## What Belongs Here

This repo holds Copilot customization assets for the [FanHub](https://github.com/MSBart2/FanHub) workshop:

- Repository instructions (`.github/copilot-instructions.md`)
- Custom prompts (`.github/prompts/*.prompt.md`)
- Custom instructions (`.github/instructions/*.instructions.md`)
- Agent skills
- MCP server configurations
- VS Code settings snippets relevant to Copilot

If it helps Copilot work better inside FanHub, it probably belongs here.

## Getting Started

1. Fork this repository
2. Create a branch: `git checkout -b feat/my-new-asset`
3. Add your asset with a clear folder structure and a brief description in `README.md`
4. Open a pull request against `main`

## Asset Guidelines

- **Self-contained** — Each asset should work independently and not break other assets.
- **Documented** — Include at minimum a comment header describing what the asset does and where it installs in FanHub.
- **Language-aware** — If an asset is specific to one FanHub language track (Node, .NET, Java, Go), make that explicit in the filename or folder.
- **No secrets** — Never commit API keys, tokens, or credentials.

## Pull Request Checklist

- [ ] Asset includes a description comment or header
- [ ] `README.md` table updated with the new asset and its target path
- [ ] No sensitive data included
- [ ] PR description explains what the asset does and when to use it

## Reporting Issues

Open a GitHub issue if you find a broken asset, a missing install step, or a Copilot customization that no longer works with a recent VS Code/Copilot release.
