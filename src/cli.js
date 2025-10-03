#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Helper function to copy directories recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Warning: Source path ${src} does not exist`);
    return;
  }

  const stat = fs.statSync(src);
  if (!stat.isDirectory()) {
    // If source is a file, copy it directly
    fs.copyFileSync(src, dest);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  files.forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    const fileStat = fs.statSync(srcFile);

    if (fileStat.isDirectory()) {
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
  const apiTypeFlag = args.find((arg) => arg.startsWith("--api-type"));

  if (!projectName) {
    console.error("Error: Project name is required");
    console.log("Usage: kalab-boilerplate create <project-name> [options]");
    console.log("Options:");
    console.log("  --template <name>     Template to use (default: basic)");
    console.log("  --plugins <list>      Comma-separated list of plugins");
    console.log(
      "  --api-type <type>     API type: 'rest' or 'graphql' (default: rest)"
    );
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

  // Parse API type
  let apiType = "rest";
  if (apiTypeFlag) {
    if (apiTypeFlag.includes("=")) {
      apiType = apiTypeFlag.split("=")[1];
    } else {
      const apiTypeIndex = args.indexOf(apiTypeFlag);
      if (apiTypeIndex + 1 < args.length) {
        apiType = args[apiTypeIndex + 1];
      }
    }
  }

  // Validate API type
  if (!["rest", "graphql"].includes(apiType)) {
    console.error(
      `Error: Invalid API type '${apiType}'. Must be 'rest' or 'graphql'`
    );
    process.exit(1);
  }

  console.log("Debug - args:", args);
  console.log("Debug - templateFlagIndex:", templateFlagIndex);
  console.log("Debug - template:", template);

  if (template === "enterprise-monorepo") {
    // Add all enterprise plugins (will be overridden by template config if available)
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
      "logging-enhanced/default",
      "security/compliance",
      "api/openapi",
      "observability/advanced",
      "design-system/default",
      "state-management/default",
      "i18n/default",
      "pwa/default",
      "ai-integration/default",
      "analytics/business",
      "dev-tools/default"
    );

    // Add API type specific plugins
    if (apiType === "graphql") {
      plugins.push("graphql/apollo");
    }
  }

  console.log(`Creating project: ${projectName}`);
  console.log("Store:", storeFlag || "@next-boilerplate/store");
  console.log("Template:", template || "none");
  console.log("API Type:", apiType);
  console.log("Plugins:", plugins.length > 0 ? plugins.join(", ") : "none");

  // Get store path for template files
  const storePath = path.dirname(__filename);

  // Override plugins with template configuration if available
  if (template === "enterprise-monorepo") {
    const templateConfigPath = path.join(
      storePath,
      "..",
      "templates",
      template,
      "config.json"
    );
    if (fs.existsSync(templateConfigPath)) {
      try {
        const templateConfig = JSON.parse(
          fs.readFileSync(templateConfigPath, "utf8")
        );
        if (templateConfig.plugins && Array.isArray(templateConfig.plugins)) {
          // Clear existing plugins and use template plugins
          plugins.length = 0;
          plugins.push(...templateConfig.plugins);
        }
      } catch (error) {
        console.warn(
          `Warning: Could not parse template config for ${template}:`,
          error.message
        );
      }
    }
  }

  // Create package.json based on template
  let packageJson;

  if (template === "enterprise-monorepo") {
    // Use the enterprise template's package.json as base
    const templatePackagePath = path.join(
      storePath,
      "..",
      "plugins",
      "package",
      "full-monorepo",
      "package.json"
    );
    packageJson = JSON.parse(fs.readFileSync(templatePackagePath, "utf8"));
    packageJson.name = projectName;
  } else {
    // Create basic package.json for other templates
    packageJson = {
      name: projectName,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: 'echo "Development server starting..."',
        build: 'echo "Building project..."',
        start: 'echo "Starting project..."',
      },
    };
  }

  // Add dependencies based on plugins
  plugins.forEach((plugin) => {
    const pluginPath = path.join(storePath, "..", "plugins", plugin);
    const configPath = path.join(pluginPath, "config.json");

    if (fs.existsSync(configPath)) {
      try {
        const pluginConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

        // Add dependencies from plugin config
        if (pluginConfig.dependencies) {
          if (!packageJson.dependencies) packageJson.dependencies = {};
          Object.assign(packageJson.dependencies, pluginConfig.dependencies);
        }

        // Add devDependencies from plugin config
        if (pluginConfig.devDependencies) {
          if (!packageJson.devDependencies) packageJson.devDependencies = {};
          Object.assign(
            packageJson.devDependencies,
            pluginConfig.devDependencies
          );
        }

        // Add scripts from plugin config
        if (pluginConfig.scripts) {
          if (!packageJson.scripts) packageJson.scripts = {};
          Object.assign(packageJson.scripts, pluginConfig.scripts);
        }
      } catch (error) {
        console.warn(
          `Warning: Could not parse config.json for plugin ${plugin}:`,
          error.message
        );
      }
    }
  });

  // Legacy plugin handling (for backward compatibility)
  if (plugins.includes("logger/default")) {
    if (!packageJson.dependencies) packageJson.dependencies = {};
    packageJson.dependencies["@kalabamssalu/logger"] = "^1.0.0";
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

  if (plugins.includes("graphql/apollo")) {
    if (!packageJson.dependencies) packageJson.dependencies = {};
    packageJson.dependencies["@apollo/client"] = "^3.8.0";
    packageJson.dependencies["graphql"] = "^16.8.0";
    packageJson.dependencies["graphql-tag"] = "^2.12.6";
    packageJson.dependencies["@apollo/experimental-nextjs-app-support"] =
      "^0.10.0";
    packageJson.dependencies["zen-observable-ts"] = "^1.2.0";
    packageJson.dependencies["@kalabamssalu/logger"] = "^1.0.0";
    packageJson.dependencies["@kalabamssalu/task"] = "^1.0.0";

    if (!packageJson.devDependencies) packageJson.devDependencies = {};
    packageJson.devDependencies["@graphql-codegen/cli"] = "^5.0.0";
    packageJson.devDependencies["@graphql-codegen/typescript"] = "^4.0.0";
    packageJson.devDependencies["@graphql-codegen/typescript-operations"] =
      "^4.0.0";
    packageJson.devDependencies["@graphql-codegen/typescript-react-apollo"] =
      "^4.0.0";
    packageJson.devDependencies[
      "@graphql-codegen/typescript-graphql-files-modules"
    ] = "^4.0.0";
    packageJson.devDependencies["@graphql-codegen/introspection"] = "^4.0.0";
    packageJson.devDependencies["eslint-plugin-graphql"] = "^4.0.0";

    packageJson.scripts["graphql:codegen"] =
      "graphql-codegen --config codegen.yml";
    packageJson.scripts["graphql:codegen:watch"] =
      "graphql-codegen --config codegen.yml --watch";
    packageJson.scripts["graphql:validate"] =
      "tsx lib/graphql-setup.ts --validate";
    packageJson.scripts["graphql:setup"] = "tsx lib/graphql-setup.ts";
  }

  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  // Copy plugin files
  plugins.forEach((plugin) => {
    const pluginPath = path.join(storePath, "..", "plugins", plugin);
    if (fs.existsSync(pluginPath)) {
      // Read plugin configuration
      const configPath = path.join(pluginPath, "config.json");
      let pluginConfig = null;

      if (fs.existsSync(configPath)) {
        try {
          pluginConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
        } catch (error) {
          console.warn(
            `Warning: Could not parse config.json for plugin ${plugin}:`,
            error.message
          );
        }
      }

      // Handle plugin configuration
      if (pluginConfig) {
        // Handle 'paths' configuration (for empty directories)
        if (pluginConfig.paths && Array.isArray(pluginConfig.paths)) {
          pluginConfig.paths.forEach((pathConfig) => {
            const srcPath = path.join(pluginPath, pathConfig.from);
            const destPath = path.join(projectPath, pathConfig.to);

            if (fs.existsSync(srcPath)) {
              copyDir(srcPath, destPath);
            } else {
              // Create empty directory if source doesn't exist
              fs.mkdirSync(destPath, { recursive: true });
            }
          });
        }

        // Handle 'files' configuration (for specific files)
        if (pluginConfig.files && Array.isArray(pluginConfig.files)) {
          pluginConfig.files.forEach((fileConfig) => {
            let srcPath, destPath;

            // Handle both string format and object format
            if (typeof fileConfig === "string") {
              srcPath = fileConfig;
              destPath = fileConfig;
            } else if (
              typeof fileConfig === "object" &&
              fileConfig.src &&
              fileConfig.dest
            ) {
              srcPath = fileConfig.src;
              destPath = fileConfig.dest;
            } else {
              console.warn(
                `Warning: Invalid file configuration in plugin ${plugin}:`,
                fileConfig
              );
              return;
            }

            const srcFile = path.join(pluginPath, srcPath);
            const destFile = path.join(projectPath, destPath);

            // Create destination directory if it doesn't exist
            const destDir = path.dirname(destFile);
            fs.mkdirSync(destDir, { recursive: true });

            if (fs.existsSync(srcFile)) {
              const srcStat = fs.statSync(srcFile);
              if (srcStat.isDirectory()) {
                // If source is a directory, copy it recursively
                copyDir(srcFile, destFile);
              } else {
                // If source is a file, copy it directly
                fs.copyFileSync(srcFile, destFile);
              }
            } else {
              console.warn(
                `Warning: File ${srcPath} not found in plugin ${plugin}`
              );
            }
          });
        }
      }

      // Fallback: Copy lib files (for backward compatibility)
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

      // Fallback: Copy other plugin files (config files, etc.) - but skip if we already handled them via config
      if (!pluginConfig || (!pluginConfig.paths && !pluginConfig.files)) {
        const pluginFiles = fs.readdirSync(pluginPath);
        pluginFiles.forEach((file) => {
          if (
            file !== "lib" &&
            file !== "config.json" &&
            file !== "package.json"
          ) {
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
  console.log(
    "  --api-type <type>   API type: 'rest' or 'graphql' (default: rest)"
  );
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
    "  kalab-boilerplate create my-app --template enterprise-monorepo --api-type graphql"
  );
  console.log(
    "  kalab-boilerplate create my-app --plugins logger/default,task/default"
  );
}
