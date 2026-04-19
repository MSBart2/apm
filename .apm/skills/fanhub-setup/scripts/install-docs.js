#!/usr/bin/env node
/**
 * Install FanHub documentation into the consumer repository
 *
 * Usage: node .github/skills/fanhub-setup/scripts/install-docs.js
 *
 * This script is part of the FanHub setup skill. It copies FanHub documentation
 * from the APM package into your project's fanhubdocs/ directory at the repo root.
 *
 * Copies all .md files from the package's fanhubdocs/ to the consumer repo's fanhubdocs/
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Get the package root from npm/apm context
let packageRoot;
try {
  // When installed via apm, the skill is at .github/skills/fanhub-setup/
  // and we can find the package by looking up to apm_modules
  packageRoot = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "apm_modules",
    "MSBart2",
    "apm",
  );
} catch (e) {
  console.error("Error determining package root");
  process.exit(1);
}

const srcDocsDir = path.join(packageRoot, "fanhubdocs");
const destDocsDir = path.join(process.cwd(), "fanhubdocs");
const srcAgentsFile = path.join(srcDocsDir, "AGENTS.md");
const destAgentsFile = path.join(process.cwd(), "AGENTS.md");

try {
  // Check if source docs directory exists
  if (!fs.existsSync(srcDocsDir)) {
    console.error(`Error: FanHub docs directory not found at ${srcDocsDir}`);
    console.error("Make sure you have run: apm install MSBart2/apm");
    process.exit(1);
  }

  // Create destination directory if needed
  if (!fs.existsSync(destDocsDir)) {
    fs.mkdirSync(destDocsDir, { recursive: true });
    console.log(`Created docs directory: ${destDocsDir}`);
  }

  // Copy all files from fanhubdocs/ to destination, except AGENTS.md (handled separately)
  let fileCopied = 0;
  const files = fs.readdirSync(srcDocsDir);

  files.forEach((file) => {
    if (file === "AGENTS.md") return; // copied to repo root below

    const srcFile = path.join(srcDocsDir, file);
    const destFile = path.join(destDocsDir, file);
    const stat = fs.statSync(srcFile);

    if (stat.isFile()) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`  ✓ Copied: fanhubdocs/${file}`);
      fileCopied++;
    }
  });

  // Copy pre-built AGENTS.md to repo root (bypasses apm compile)
  if (fs.existsSync(srcAgentsFile)) {
    fs.copyFileSync(srcAgentsFile, destAgentsFile);
    console.log(`  ✓ Copied: AGENTS.md → repo root`);
    fileCopied++;
  } else {
    console.warn(`  ⚠ AGENTS.md not found in package — skipping`);
  }

  console.log("");
  console.log(`✓ FanHub documentation installed (${fileCopied} file(s))`);
  console.log(`  Docs location: ${destDocsDir}`);
  console.log(`  AGENTS.md:     ${destAgentsFile}`);

  process.exit(0);
} catch (error) {
  console.error("Error installing documentation:", error.message);
  process.exit(1);
}
