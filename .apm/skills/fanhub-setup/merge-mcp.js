#!/usr/bin/env node
/**
 * Merge FanHub MCP servers into .vscode/mcp.json without overwriting existing servers
 * 
 * Usage: node .github/skills/fanhub-setup/merge-mcp.js
 * 
 * This script is part of the FanHub setup skill. It safely merges FanHub MCP server
 * configurations into your project's .vscode/mcp.json without destroying pre-existing
 * MCP configurations.
 */

const fs = require('fs');
const path = require('path');

// Find mcp-servers.json in the APM package root
// This script runs from .github/skills/fanhub-setup/, so we go up to project root,
// then into apm_modules/MSBart2/apm/
const packageRoot = path.join(__dirname, '..', '..', '..', '..', 'apm_modules', 'MSBart2', 'apm');
const mcpServersFile = path.join(packageRoot, 'mcp-servers.json');
const mcpJsonFile = path.join(process.cwd(), '.vscode', 'mcp.json');
const mcpJsonDir = path.dirname(mcpJsonFile);

try {
  // Read FanHub MCP server definitions
  if (!fs.existsSync(mcpServersFile)) {
    console.error(`Error: mcp-servers.json not found at ${mcpServersFile}`);
    console.error('Make sure you have run: apm install MSBart2/apm');
    process.exit(1);
  }

  const fanhubServers = JSON.parse(fs.readFileSync(mcpServersFile, 'utf8')).mcpServers;

  // Read existing mcp.json or create new object
  let mcpConfig = { mcpServers: {} };
  if (fs.existsSync(mcpJsonFile)) {
    try {
      mcpConfig = JSON.parse(fs.readFileSync(mcpJsonFile, 'utf8'));
    } catch (e) {
      console.warn(`Warning: Could not parse existing ${mcpJsonFile}, will create new one`);
    }
  }

  // Ensure mcpServers object exists
  if (!mcpConfig.mcpServers) {
    mcpConfig.mcpServers = {};
  }

  // Merge FanHub servers (overwrite any existing ones with same name, but preserve others)
  Object.assign(mcpConfig.mcpServers, fanhubServers);

  // Create directory if needed
  if (!fs.existsSync(mcpJsonDir)) {
    fs.mkdirSync(mcpJsonDir, { recursive: true });
  }

  // Write merged config
  fs.writeFileSync(mcpJsonFile, JSON.stringify(mcpConfig, null, 2) + '\n', 'utf8');
  console.log(`✓ Merged FanHub MCP servers into ${mcpJsonFile}`);
  console.log(`  - Added/Updated ${Object.keys(fanhubServers).length} server(s)`);
  console.log(`  - Total servers now: ${Object.keys(mcpConfig.mcpServers).length}`);
  console.log('');
  console.log('✓ Setup complete! Your MCP configuration is ready.');
  console.log('  Next: Start your FanHub backend (e.g., cd dotnet/Backend && dotnet run)');

  process.exit(0);
} catch (error) {
  console.error('Error merging MCP servers:', error.message);
  process.exit(1);
}
