# FanHub APM — Agent Package Manager

A curated collection of GitHub Copilot customization assets that can be installed into the [FanHub](https://github.com/MSBart2/FanHub) workshop repository to supercharge AI-assisted development.

## What Is This?

This repo packages the "goodness" — repository instructions, custom prompts, agent skills, MCP server configs, and other Copilot customization files — that participants and instructors add to FanHub during the [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop) training modules.

Instead of building each artifact from scratch during a workshop session, you can pull from this package and install the pieces you need.

## What's Included

| Asset                 | Description | Target Path in FanHub |
| --------------------- | ----------- | --------------------- |
| _(files coming soon)_ |             |                       |

## Installation

Clone this repo alongside your FanHub fork, then copy or symlink the assets you want:

```bash
git clone https://github.com/MSBart2/apm.git
cd apm
# follow per-asset instructions below
```

Per-asset installation steps will be documented here as files are added.

## Relationship to FanHub

[FanHub](https://github.com/MSBart2/FanHub) is an intentionally incomplete, buggy multi-language fan-site starter used for GitHub Copilot workshops. It ships with:

- Four language tracks: Node.js, .NET, Java, Go
- Pre-loaded Breaking Bad content (characters, episodes, quotes)
- 183+ deliberate bugs for participants to fix with Copilot's help

The APM assets in this repo are the Copilot customization layer that transforms FanHub from a "Copilot struggles here" baseline into a fully configured, AI-assisted project.

## Prerequisites

- A fork or clone of [FanHub](https://github.com/MSBart2/FanHub)
- GitHub Copilot (Individual, Business, or Enterprise)
- VS Code with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).
