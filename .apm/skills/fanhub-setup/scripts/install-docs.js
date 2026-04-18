#!/usr/bin/env node
/**
 * Install FanHub documentation into the consumer repository
 *
 * Usage: node .github/skills/fanhub-setup/scripts/install-docs.js
 *
 * This script is part of the FanHub setup skill. It copies FanHub documentation
 * from the APM package into your project's fanhubdocs/ directory at the repo root.
 *
 * Copies all .md files from apm_modules/MSBart2/apm/fanhubdocs/ to fanhubdocs/
 */

const fs = require("fs");
const path = require("path");

// Paths
const packageRoot = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "apm_modules",
  "MSBart2",
  "apm",
);
const srcDocsDir = path.join(packageRoot, "fanhubdocs");
const destDocsDir = path.join(process.cwd(), "fanhubdocs");

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

  // Copy all files from source to destination
  let fileCopied = 0;
  const files = fs.readdirSync(srcDocsDir);

  files.forEach((file) => {
    const srcFile = path.join(srcDocsDir, file);
    const destFile = path.join(destDocsDir, file);
    const stat = fs.statSync(srcFile);

    if (stat.isFile()) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`  ✓ Copied: ${file}`);
      fileCopied++;
    }
  });

  console.log("");
  console.log(`✓ FanHub documentation installed (${fileCopied} file(s))`);
  console.log(`  Location: ${destDocsDir}`);
  console.log("");
  console.log("📚 Available documents:");
  files.forEach((file) => {
    const stat = fs.statSync(path.join(srcDocsDir, file));
    if (stat.isFile()) {
      console.log(`  - ${file}`);
    }
  });

  process.exit(0);
} catch (error) {
  console.error("Error installing documentation:", error.message);
  process.exit(1);
}
