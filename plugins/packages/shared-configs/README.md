# @repo/shared-configs

Shared configuration files for the monorepo, including ESLint, TypeScript, Tailwind CSS, Prettier, Jest, and Playwright configurations.

## Features

- **ESLint**: TypeScript, React, and Next.js configurations
- **TypeScript**: Strict configuration with path mapping
- **Tailwind CSS**: Custom design system with CSS variables
- **Prettier**: Consistent code formatting
- **Jest**: Testing configuration for Next.js
- **Playwright**: End-to-end testing configuration

## Configurations

### ESLint

- `eslint.js` - Base TypeScript configuration
- `eslint-react.js` - React-specific rules
- `eslint-nextjs.js` - Next.js-specific rules

### TypeScript

- `typescript.json` - Strict TypeScript configuration with path mapping

### Tailwind CSS

- `tailwind.js` - Custom design system with CSS variables

### Prettier

- `prettier.json` - Code formatting rules

### Testing

- `jest.config.js` - Unit testing configuration
- `playwright.config.js` - E2E testing configuration

## Usage

### In package.json

```json
{
  "eslintConfig": {
    "extends": ["@repo/shared-configs/eslint-nextjs"]
  },
  "prettier": "@repo/shared-configs/prettier"
}
```

### In tsconfig.json

```json
{
  "extends": "@repo/shared-configs/typescript"
}
```

### In tailwind.config.js

```javascript
module.exports = require("@repo/shared-configs/tailwind");
```

### In jest.config.js

```javascript
module.exports = require("@repo/shared-configs/jest");
```

### In playwright.config.js

```javascript
module.exports = require("@repo/shared-configs/playwright");
```

## Development

```bash
# Build the package
npm run build

# Watch for changes
npm run dev

# Type check
npm run type-check

# Clean build artifacts
npm run clean
```

## Contributing

1. Update the appropriate configuration file
2. Test the configuration in a sample project
3. Update the README if needed
4. Ensure backward compatibility

## License

MIT


