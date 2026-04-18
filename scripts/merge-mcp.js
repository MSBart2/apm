#!/usr/bin/env node
/**
 * Merge FanHub MCP servers into .vscode/mcp.json without overwriting existing servers
 * Usage: node scripts/merge-mcp.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const mcpServersFile = path.join(__dirname, '..', 'mcp-servers.json');
const mcpJsonFile = path.join(process.cwd(), '.vscode', 'mcp.json');
const mcpJsonDir = path.dirname(mcpJsonFile);

try {
  // Read FanHub MCP server definitions
  if (!fs.existsSync(mcpServersFile)) {
    console.error(`Error: mcp-servers.json not found at ${mcpServersFile}`);
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

  // Merge FanHub servers (overwrite any existing ones with same name)
  Object.assign(mcpConfig.mcpServers, fanhubServers);

  // Create directory if needed
  if (!fs.existsSync(mcpJsonDir)) {
    fs.mkdirSync(mcpJsonDir, { recursive: true });
  }

  // Write merged config
  fs.writeFileSync(mcpJsonFile, JSON.stringify(mcpConfig, null, 2) + '\n', 'utf8');
  console.log(`✓ Merged FanHub MCP servers into ${mcpJsonFile}`);
  console.log(`  - Added ${Object.keys(fanhubServers).length} server(s)`);
  console.log(`  - Total servers: ${Object.keys(mcpConfig.mcpServers).length}`);

  process.exit(0);
} catch (error) {
  console.error('Error merging MCP servers:', error.message);
  process.exit(1);
}
