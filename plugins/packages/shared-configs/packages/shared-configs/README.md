# Shared Configs Package

A centralized configuration package for ESLint, TypeScript, Tailwind CSS, Prettier, Jest, and Playwright across the monorepo.

## Features

- 🔧 **ESLint Configs**: Base, React, and Next.js configurations
- 📝 **TypeScript**: Shared TypeScript configuration with path mapping
- 🎨 **Tailwind CSS**: Shared Tailwind configuration with design system
- 💅 **Prettier**: Consistent code formatting configuration
- 🧪 **Jest**: Testing configuration with coverage thresholds
- 🎭 **Playwright**: E2E testing configuration

## Installation

This package is automatically included in the monorepo. To use it in your apps:

```bash
# In your app's package.json
{
  "devDependencies": {
    "@repo/shared-configs": "workspace:*"
  }
}
```

## Usage

### ESLint Configuration

#### Base ESLint Config

```js
// .eslintrc.js
module.exports = {
  extends: ['@repo/shared-configs/eslint'],
};
```

#### React ESLint Config

```js
// .eslintrc.js
module.exports = {
  extends: ['@repo/shared-configs/eslint-react'],
};
```

#### Next.js ESLint Config

```js
// .eslintrc.js
module.exports = {
  extends: ['@repo/shared-configs/eslint-nextjs'],
};
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "extends": "@repo/shared-configs/typescript",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind CSS Configuration

```js
// tailwind.config.js
module.exports = {
  extends: ['@repo/shared-configs/tailwind'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
```

### Prettier Configuration

```json
// .prettierrc
"@repo/shared-configs/prettier"
```

### Jest Configuration

```js
// jest.config.js
module.exports = {
  ...require('@repo/shared-configs/jest'),
  // Your custom configuration
};
```

### Playwright Configuration

```js
// playwright.config.js
module.exports = {
  ...require('@repo/shared-configs/playwright'),
  // Your custom configuration
};
```

## Configuration Details

### ESLint Rules

The shared ESLint configurations include:

- **Base**: TypeScript, import organization, Prettier integration
- **React**: React and React Hooks rules, accessibility checks
- **Next.js**: Next.js specific rules and optimizations

### TypeScript Configuration

- Strict mode enabled
- Path mapping for clean imports
- Modern ES2021 target
- React JSX support

### Tailwind CSS

- Design system colors and spacing
- Custom animations and keyframes
- Responsive breakpoints
- Dark mode support

### Prettier

- Consistent formatting rules
- Single quotes and semicolons
- 80 character line width
- 2 space indentation

### Jest

- TypeScript support
- Coverage thresholds (80%)
- Path mapping for monorepo packages
- React Testing Library setup

### Playwright

- Multi-browser testing
- Mobile device testing
- Automatic server startup
- Trace on retry

## Customization

### Extending Configurations

You can extend any configuration and override specific rules:

```js
// .eslintrc.js
module.exports = {
  extends: ['@repo/shared-configs/eslint-react'],
  rules: {
    // Override specific rules
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
```

### Adding Custom Rules

```js
// .eslintrc.js
module.exports = {
  extends: ['@repo/shared-configs/eslint'],
  rules: {
    // Add custom rules
    'custom-rule': 'error',
  },
};
```

## Development

### Building

```bash
npm run build
```

### Development mode

```bash
npm run dev
```

### Type checking

```bash
npm run type-check
```

## Integration with Apps

### Web App

```js
// apps/web/.eslintrc.js
module.exports = {
  extends: ['@repo/shared-configs/eslint-nextjs'],
};

// apps/web/tailwind.config.js
module.exports = {
  extends: ['@repo/shared-configs/tailwind'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
```

### Docs App

```js
// apps/docs/.eslintrc.js
module.exports = {
  extends: ['@repo/shared-configs/eslint-react'],
};

// apps/docs/tailwind.config.js
module.exports = {
  extends: ['@repo/shared-configs/tailwind'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
```

## Best Practices

1. **Always extend shared configs** instead of duplicating them
2. **Override specific rules** rather than replacing entire configurations
3. **Use path mapping** for clean imports across the monorepo
4. **Maintain consistency** by using the same configuration across all apps
5. **Update shared configs** when adding new rules or patterns

## Contributing

1. Make sure all tests pass
2. Run type checking: `npm run type-check`
3. Build the package: `npm run build`
4. Test configurations in apps before committing
5. Update documentation for any new configurations

## License

MIT
