# Development Tools Plugin

This plugin provides a comprehensive development environment setup with ESLint, Prettier, Husky, and
TypeScript configuration for modern web development.

## Features

- **ESLint**: TypeScript, React, and accessibility linting
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for pre-commit and pre-push checks
- **Lint-staged**: Run linters on staged files only
- **TypeScript**: Strict type checking configuration

## Quick Start

1. **Setup the development environment:**

   ```bash
   npm run dev:setup
   ```

2. **Run linting:**

   ```bash
   npm run lint
   npm run lint:fix
   ```

3. **Format code:**

   ```bash
   npm run format
   npm run format:check
   ```

4. **Type checking:**
   ```bash
   npm run type-check
   ```

## Available Scripts

| Script         | Description                                |
| -------------- | ------------------------------------------ |
| `dev:setup`    | Setup the complete development environment |
| `lint`         | Run ESLint on all files                    |
| `lint:fix`     | Fix ESLint issues automatically            |
| `format`       | Format code with Prettier                  |
| `format:check` | Check code formatting                      |
| `type-check`   | Run TypeScript type checking               |
| `prepare`      | Install Husky Git hooks                    |
| `pre-commit`   | Run lint-staged on staged files            |

## Configuration Files

### ESLint (.eslintrc.json)

- TypeScript support with strict rules
- React and React Hooks linting
- Accessibility (a11y) checks
- Import/export organization
- Prettier integration

### Prettier (.prettierrc)

- Consistent code formatting
- Single quotes, semicolons
- 80 character line width
- 2 space indentation

### Husky (.husky/)

- **pre-commit**: Run lint-staged on staged files
- **pre-push**: Full linting, type checking, and tests

### Lint-staged (.lintstagedrc.js)

- Run ESLint and Prettier on staged files
- Support for TypeScript, JavaScript, JSON, YAML, Markdown, CSS

### TypeScript (tsconfig.json)

- Strict type checking
- Modern ES2021 target
- React JSX support
- Path mapping for clean imports

## Git Hooks

### Pre-commit Hook

- Runs lint-staged on staged files
- Automatically fixes issues where possible
- Prevents commits with linting errors

### Pre-push Hook

- Full project linting
- TypeScript type checking
- Code formatting verification
- Optional test running
- Prevents pushes with uncommitted changes

## Usage Examples

### Basic Setup

```bash
# Setup everything
npm run dev:setup

# Or setup specific parts
npm run dev:setup -- --no-deps --no-husky
```

### Linting

```bash
# Check all files
npm run lint

# Fix issues automatically
npm run lint:fix

# Check specific files
npx eslint src/**/*.ts
```

### Formatting

```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Format specific files
npx prettier --write src/**/*.ts
```

### Type Checking

```bash
# Check types
npm run type-check

# Watch mode
npx tsc --noEmit --watch
```

## Customization

### ESLint Rules

Edit `.eslintrc.json` to customize linting rules:

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "react/prop-types": "off"
  }
}
```

### Prettier Options

Edit `.prettierrc` to customize formatting:

```json
{
  "printWidth": 100,
  "tabWidth": 4,
  "singleQuote": false
}
```

### Husky Hooks

Edit `.husky/pre-commit` or `.husky/pre-push` to customize Git hooks:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Add custom checks
npm run custom-check
```

## Best Practices

1. **Always run `npm run dev:setup`** when setting up a new project
2. **Use `npm run lint:fix`** before committing to fix issues automatically
3. **Run `npm run format`** to ensure consistent code formatting
4. **Use `npm run type-check`** to catch TypeScript errors early
5. **Commit often** to take advantage of pre-commit hooks
6. **Push regularly** to benefit from pre-push checks

## Troubleshooting

### Common Issues

1. **ESLint errors**: Run `npm run lint:fix` to fix most issues automatically
2. **Prettier conflicts**: Run `npm run format` to resolve formatting issues
3. **TypeScript errors**: Check `tsconfig.json` and run `npm run type-check`
4. **Husky not working**: Run `npm run prepare` to reinstall Git hooks

### Reset Configuration

```bash
# Remove all config files
rm .eslintrc.json .prettierrc .prettierignore .lintstagedrc.js tsconfig.json
rm -rf .husky

# Recreate everything
npm run dev:setup
```

## Integration with Other Plugins

This plugin works seamlessly with:

- **GraphQL Plugin**: Adds GraphQL-specific ESLint rules
- **Design System Plugin**: Integrates with component linting
- **State Management Plugin**: Supports Zustand and React Query patterns

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the configuration files
3. Run `npm run dev:setup` to reset the environment
4. Check the plugin documentation for specific integrations
