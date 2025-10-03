# @repo/shared-ui

A shared UI component library for the monorepo, built with React, TypeScript, and Tailwind CSS.

## Features

- **Modern Components**: Pre-built, accessible components using Radix UI primitives
- **TypeScript**: Full type safety and IntelliSense support
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Dark Mode**: Built-in theme support with system preference detection
- **Accessibility**: WCAG compliant components with proper ARIA attributes
- **Customizable**: Easy to extend and customize with CSS variables

## Components

### Basic Components

- `Button` - Versatile button component with multiple variants
- `Input` - Form input component with validation states
- `Card` - Container component for content grouping

### Layout Components

- `Dialog` - Modal dialog component with overlay
- `Modal` - Higher-level modal component with common patterns
- `Loading` - Loading spinner with customizable sizes
- `ErrorBoundary` - Error boundary component for error handling

## Hooks

- `useTheme` - Theme management with system preference detection
- `useLocalStorage` - Local storage management with type safety
- `useDebounce` - Debounced value hook for performance optimization

## Utils

- `cn` - Utility for merging Tailwind CSS classes
- `formatDate` - Date formatting utilities
- `formatCurrency` - Currency formatting utilities
- `formatNumber` - Number formatting utilities

## Installation

```bash
npm install @repo/shared-ui
```

## Usage

```tsx
import { Button, Card, CardContent, useTheme } from "@repo/shared-ui";

function App() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardContent>
        <Button onClick={() => setTheme("dark")}>Toggle Theme</Button>
      </CardContent>
    </Card>
  );
}
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

1. Create your component in the appropriate directory
2. Export it from `src/index.ts`
3. Add proper TypeScript types
4. Include usage examples in the README
5. Test your component thoroughly

## License

MIT


