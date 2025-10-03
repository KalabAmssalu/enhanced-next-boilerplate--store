# Shared UI Package

A comprehensive shared UI component library for the monorepo, built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern Components**: Button, Card, Input, Dialog, Modal, Loading, ErrorBoundary
- 🎯 **TypeScript**: Full type safety and IntelliSense support
- 🎨 **Tailwind CSS**: Utility-first styling with design system
- 🔧 **Customizable**: Variant-based component system
- 📱 **Responsive**: Mobile-first design approach
- ♿ **Accessible**: Built with accessibility in mind using Radix UI primitives

## Installation

This package is automatically included in the monorepo. To use it in your apps:

```bash
# In your app's package.json
{
  "dependencies": {
    "@repo/shared-ui": "workspace:*"
  }
}
```

## Usage

### Basic Components

```tsx
import { Button, Card, Input, Modal } from "@repo/shared-ui";

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>This is a shared component</CardDescription>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter your name" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Hooks

```tsx
import { useTheme, useLocalStorage, useDebounce } from "@repo/shared-ui";

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [value, setValue] = useLocalStorage("my-key", "default");
  const debouncedValue = useDebounce(value, 500);

  return (
    <div>
      <p>Current theme: {resolvedTheme}</p>
      <button onClick={() => setTheme("dark")}>Toggle Theme</button>
    </div>
  );
}
```

### Utilities

```tsx
import { cn, formatDate, formatCurrency } from "@repo/shared-ui";

function MyComponent() {
  const className = cn("base-class", "conditional-class");
  const formattedDate = formatDate(new Date());
  const price = formatCurrency(99.99);

  return (
    <div className={className}>
      <p>Date: {formattedDate}</p>
      <p>Price: {price}</p>
    </div>
  );
}
```

## Components

### Button

```tsx
import { Button } from '@repo/shared-ui';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// As child component
<Button asChild>
  <a href="/link">Link Button</a>
</Button>
```

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@repo/shared-ui";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <p>Card footer</p>
  </CardFooter>
</Card>;
```

### Input

```tsx
import { Input } from '@repo/shared-ui';

<Input type="text" placeholder="Enter text" />
<Input type="email" placeholder="Enter email" />
<Input type="password" placeholder="Enter password" />
```

### Dialog & Modal

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Modal } from '@repo/shared-ui';

// Using Dialog directly
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>

// Using Modal wrapper
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  description="Modal description"
>
  <p>Modal content</p>
</Modal>
```

### Loading

```tsx
import { Loading } from '@repo/shared-ui';

<Loading size="sm" />
<Loading size="md" text="Loading..." />
<Loading size="lg" />
```

### ErrorBoundary

```tsx
import { ErrorBoundary } from '@repo/shared-ui';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<div>Custom error message</div>}>
  <MyComponent />
</ErrorBoundary>
```

## Hooks

### useTheme

```tsx
import { useTheme } from "@repo/shared-ui";

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {resolvedTheme}</p>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}
```

### useLocalStorage

```tsx
import { useLocalStorage } from "@repo/shared-ui";

function MyComponent() {
  const [name, setName] = useLocalStorage("user-name", "");
  const [count, setCount] = useLocalStorage("counter", 0);

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}
```

### useDebounce

```tsx
import { useDebounce } from "@repo/shared-ui";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      // Perform search
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## Utilities

### cn (className utility)

```tsx
import { cn } from "@repo/shared-ui";

// Merge classes
const className = cn("base-class", "conditional-class");

// With conditions
const buttonClass = cn(
  "btn",
  {
    "btn-primary": isPrimary,
    "btn-secondary": !isPrimary,
  },
  className
);
```

### Format utilities

```tsx
import {
  formatDate,
  formatCurrency,
  formatNumber,
  formatRelativeTime,
} from "@repo/shared-ui";

// Date formatting
formatDate(new Date()); // "January 1, 2024"
formatDate(new Date(), { month: "short", day: "numeric" }); // "Jan 1"

// Currency formatting
formatCurrency(99.99); // "$99.99"
formatCurrency(99.99, "EUR", "de-DE"); // "99,99 €"

// Number formatting
formatNumber(1234.56); // "1,234.56"
formatNumber(1234.56, { minimumFractionDigits: 2 }); // "1,234.56"

// Relative time
formatRelativeTime(new Date(Date.now() - 1000 * 60 * 5)); // "5 minutes ago"
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

## Styling

This package uses Tailwind CSS for styling. Make sure your app has Tailwind CSS configured and includes the shared UI styles.

### Required Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@repo/shared-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add your custom theme extensions
    },
  },
  plugins: [],
};
```

### Required CSS

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Contributing

1. Make sure all tests pass
2. Run type checking: `npm run type-check`
3. Build the package: `npm run build`
4. Follow the existing code style and patterns

## License

MIT
