#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Documentation generation script
 * Generates API documentation, updates changelog, and builds docs site
 */

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    log(`Running: ${command}`, "blue");
    execSync(command, { stdio: "inherit", ...options });
    return true;
  } catch (error) {
    log(`Error running command: ${command}`, "red");
    log(error.message, "red");
    return false;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`, "green");
  }
}

function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!checkFileExists(packageJsonPath)) {
    log("package.json not found", "red");
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Add documentation scripts if they don't exist
  const docScripts = {
    "docs:build": "docusaurus build",
    "docs:start": "docusaurus start",
    "docs:deploy": "docusaurus deploy",
    "docs:api": "typedoc --out docs/api src",
    "docs:generate": "node scripts/generate-docs.js",
    "docs:changelog": "node scripts/update-changelog.js",
    "docs:serve": "docusaurus serve",
  };

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  Object.entries(docScripts).forEach(([script, command]) => {
    if (!packageJson.scripts[script]) {
      packageJson.scripts[script] = command;
    }
  });

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log("Updated package.json with documentation scripts", "green");
  return true;
}

function generateApiDocs() {
  log("Generating API documentation...", "cyan");

  const srcDir = path.join(process.cwd(), "src");
  const docsApiDir = path.join(process.cwd(), "docs", "api");

  if (!checkFileExists(srcDir)) {
    log("src directory not found, skipping API docs generation", "yellow");
    return true;
  }

  createDirectory(docsApiDir);

  return exec("npx typedoc --out docs/api src");
}

function updateChangelog() {
  log("Updating changelog...", "cyan");

  const changelogPath = path.join(process.cwd(), "CHANGELOG.md");

  if (!checkFileExists(changelogPath)) {
    log("CHANGELOG.md not found, creating...", "yellow");

    const changelogContent = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup

### Changed

### Deprecated

### Removed

### Fixed

### Security
`;

    fs.writeFileSync(changelogPath, changelogContent);
    log("Created CHANGELOG.md", "green");
  }

  return exec("npx conventional-changelog -p angular -i CHANGELOG.md -s");
}

function buildDocsSite() {
  log("Building documentation site...", "cyan");

  const docusaurusConfigPath = path.join(process.cwd(), "docusaurus.config.js");

  if (!checkFileExists(docusaurusConfigPath)) {
    log("docusaurus.config.js not found, skipping docs site build", "yellow");
    return true;
  }

  return exec("npm run docs:build");
}

function generateReadme() {
  log("Generating README.md...", "cyan");

  const readmePath = path.join(process.cwd(), "README.md");
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!checkFileExists(packageJsonPath)) {
    log("package.json not found, skipping README generation", "yellow");
    return true;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const readmeContent = `# ${packageJson.name}

${
  packageJson.description ||
  "A modern Next.js boilerplate with TypeScript, testing, and deployment ready setup."
}

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
\`\`\`

## 📚 Documentation

- [Getting Started](./docs/DEVELOPMENT.md)
- [API Reference](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Contributing](./docs/CONTRIBUTING.md)

## 🛠️ Available Scripts

\`\`\`bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:visual      # Run visual regression tests

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run prettier         # Check Prettier formatting
npm run prettier:fix     # Fix Prettier formatting

# Performance
npm run analyze          # Analyze bundle size
npm run lighthouse       # Run Lighthouse audits

# Security
npm run security:scan    # Run security scans

# Documentation
npm run docs:build       # Build documentation
npm run docs:start       # Start documentation server
npm run docs:api         # Generate API documentation
\`\`\`

## 🏗️ Project Structure

\`\`\`
├── apps/                 # Applications
│   ├── web/             # Main web application
│   └── admin/           # Admin dashboard
├── packages/            # Shared packages
│   ├── ui/              # UI components
│   ├── config/          # Shared configurations
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── docs/                # Documentation
├── scripts/             # Build and utility scripts
└── tests/               # Test files
\`\`\`

## 🧪 Testing

This project includes comprehensive testing:

- **Unit Tests**: Vitest for fast unit testing
- **Integration Tests**: API and component testing
- **E2E Tests**: Playwright for end-to-end testing
- **Visual Tests**: Chromatic for visual regression testing

## 🚀 Deployment

The project is configured for multiple deployment options:

- **Vercel**: Optimized for Next.js
- **Docker**: Containerized deployment
- **Kubernetes**: Production-ready manifests

## 📄 License

${packageJson.license || "MIT"}

## 🤝 Contributing

Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📞 Support

- 📖 **Documentation**: [docs.your-site.com](https://docs.your-site.com)
- 💬 **Discord**: [Join our community](https://discord.gg/your-invite)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/next-boilerplate/issues)
`;

  fs.writeFileSync(readmePath, readmeContent);
  log("Generated README.md", "green");
  return true;
}

function main() {
  log("🚀 Starting documentation generation...", "bright");

  const steps = [
    { name: "Update package.json", fn: updatePackageJson },
    { name: "Generate README", fn: generateReadme },
    { name: "Update changelog", fn: updateChangelog },
    { name: "Generate API docs", fn: generateApiDocs },
    { name: "Build docs site", fn: buildDocsSite },
  ];

  let successCount = 0;

  steps.forEach((step, index) => {
    log(`\n[${index + 1}/${steps.length}] ${step.name}`, "magenta");

    if (step.fn()) {
      successCount++;
      log(`✅ ${step.name} completed`, "green");
    } else {
      log(`❌ ${step.name} failed`, "red");
    }
  });

  log(`\n🎉 Documentation generation completed!`, "bright");
  log(
    `✅ ${successCount}/${steps.length} steps completed successfully`,
    "green"
  );

  if (successCount === steps.length) {
    log("\n📚 Documentation is ready!", "cyan");
    log('Run "npm run docs:start" to view the documentation locally.', "blue");
  } else {
    log(
      "\n⚠️  Some steps failed. Check the output above for details.",
      "yellow"
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateApiDocs,
  updateChangelog,
  buildDocsSite,
  generateReadme,
  updatePackageJson,
};
