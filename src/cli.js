#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Helper function to copy directories recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  files.forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    const stat = fs.statSync(srcFile);

    if (stat.isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === "create") {
  const projectName = args[1];
  const storeFlag = args.find((arg) => arg.startsWith("--store"));
  const pluginsFlag = args.find((arg) => arg.startsWith("--plugins"));

  if (!projectName) {
    console.error("Error: Project name is required");
    console.log("Usage: kalab-boilerplate create <project-name> [options]");
    process.exit(1);
  }

  // Create project directory
  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.error(`Error: Directory ${projectName} already exists`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath, { recursive: true });

  // Copy template files based on plugins
  const plugins = pluginsFlag ? pluginsFlag.split("=")[1].split(",") : [];

  // Check if using enterprise template
  const templateFlagIndex = args.findIndex((arg) =>
    arg.startsWith("--template")
  );
  let template = null;

  if (templateFlagIndex !== -1) {
    const templateFlag = args[templateFlagIndex];
    if (templateFlag.includes("=")) {
      // Format: --template=enterprise-monorepo
      template = templateFlag.split("=")[1];
    } else {
      // Format: --template enterprise-monorepo
      template = args[templateFlagIndex + 1];
    }
  }

  console.log("Debug - args:", args);
  console.log("Debug - templateFlagIndex:", templateFlagIndex);
  console.log("Debug - template:", template);

  if (template === "enterprise-monorepo") {
    // Add all enterprise plugins
    plugins.push(
      "turbo/default",
      "devcontainer/default",
      "apps/empty",
      "packages/empty",
      "conventional-commits/default",
      "vscode/default",
      "github/workflows/default",
      "github/issue-template/default",
      "gitignore/default",
      "releaserc/default",
      "license/default",
      "makefile/default",
      "renovate/default",
      "package/full-monorepo",
      "security/default",
      "testing/enhanced",
      "monitoring/default",
      "performance/default",
      "documentation/default",
      "infrastructure/default",
      "logging-enhanced/default"
    );
  }

  console.log(`Creating project: ${projectName}`);
  console.log("Store:", storeFlag || "@next-boilerplate/store");
  console.log("Template:", template || "none");
  console.log("Plugins:", plugins.length > 0 ? plugins.join(", ") : "none");

  // Create basic package.json
  const packageJson = {
    name: projectName,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: 'echo "Development server starting..."',
      build: 'echo "Building project..."',
      start: 'echo "Starting project..."',
    },
  };

  // Add dependencies based on plugins
  if (plugins.includes("logger/default")) {
    packageJson.dependencies = {
      "@kalabamssalu/logger": "^1.0.0",
    };
    packageJson.scripts["log:example"] = "tsx lib/logger-example.ts";
  }

  if (plugins.includes("task/default")) {
    if (!packageJson.dependencies) packageJson.dependencies = {};
    packageJson.dependencies["@kalabamssalu/task"] = "^1.0.0";
    packageJson.scripts["task:example"] = "tsx lib/task-example.ts";
  }

  if (plugins.includes("logging-enhanced/default")) {
    if (!packageJson.dependencies) packageJson.dependencies = {};
    packageJson.dependencies["@kalabamssalu/logger"] = "^1.0.0";
    packageJson.dependencies["@kalabamssalu/task"] = "^1.0.0";
    packageJson.scripts["logging:demo"] = "tsx lib/logging-demo.ts";
    packageJson.scripts["logging:init"] = "tsx lib/enhanced-logging.ts";
  }

  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  // Copy plugin files
  const storePath = path.dirname(__filename);
  plugins.forEach((plugin) => {
    const pluginPath = path.join(storePath, "..", "plugins", plugin);
    if (fs.existsSync(pluginPath)) {
      // Copy lib files
      const libPath = path.join(pluginPath, "lib");
      if (fs.existsSync(libPath)) {
        const destLibPath = path.join(projectPath, "lib");
        fs.mkdirSync(destLibPath, { recursive: true });

        const files = fs.readdirSync(libPath);
        files.forEach((file) => {
          const srcFile = path.join(libPath, file);
          const destFile = path.join(destLibPath, file);
          fs.copyFileSync(srcFile, destFile);
        });
      }

      // Copy other plugin files (config files, etc.)
      const pluginFiles = fs.readdirSync(pluginPath);
      pluginFiles.forEach((file) => {
        if (file !== "lib" && file !== "config.json") {
          const srcFile = path.join(pluginPath, file);
          const destFile = path.join(projectPath, file);
          const stat = fs.statSync(srcFile);
          if (stat.isDirectory()) {
            // Copy directory recursively
            copyDir(srcFile, destFile);
          } else {
            // Copy file
            fs.copyFileSync(srcFile, destFile);
          }
        }
      });
    }
  });

  console.log(`✅ Project ${projectName} created successfully!`);
  console.log(`📁 Location: ${projectPath}`);
  console.log("🚀 Next steps:");
  console.log(`   cd ${projectName}`);
  console.log("   npm install");
  console.log("   npm run dev");
} else {
  console.log("Next.js Boilerplate Store CLI");
  console.log("");
  console.log("Usage:");
  console.log("  kalab-boilerplate create <project-name> [options]");
  console.log("");
  console.log("Options:");
  console.log("  --store <store>     Specify the store to use");
  console.log("  --plugins <plugins> Comma-separated list of plugins");
  console.log("  --template <template> Use a predefined template");
  console.log("");
  console.log("Templates:");
  console.log("  enterprise-monorepo  Full enterprise setup with all plugins");
  console.log("");
  console.log("Examples:");
  console.log("  kalab-boilerplate create my-app");
  console.log("  kalab-boilerplate create my-app --plugins logger/default");
  console.log(
    "  kalab-boilerplate create my-app --template enterprise-monorepo"
  );
  console.log(
    "  kalab-boilerplate create my-app --plugins logger/default,task/default"
  );
}
