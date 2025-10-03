# Web App

A modern Next.js web application built with shared components and utilities from the monorepo.

## Features

- 🚀 **Next.js 14** with App Router
- 🎨 **Shared UI Components** from `@repo/shared-ui`
- ⚙️ **Shared Configurations** from `@repo/shared-configs`
- 📚 **Shared Libraries** from `@repo/shared-lib`
- 🎨 **Tailwind CSS** for styling
- 🌙 **Dark Mode** support with next-themes
- 📱 **Responsive Design** mobile-first approach
- ♿ **Accessibility** built-in with Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── utils.ts          # Utility functions
│   └── constants.ts      # App constants
├── package.json          # Dependencies and scripts
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── .eslintrc.js          # ESLint configuration
```

## Configuration

### Next.js Configuration

The app uses Next.js 14 with App Router. Configuration is in `next.config.js`:

```js
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@repo/shared-ui', '@repo/shared-configs', '@repo/shared-lib'],
  // ... other config
};
```

### Tailwind CSS

Tailwind configuration extends the shared config:

```js
module.exports = {
  extends: ['@repo/shared-configs/tailwind'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
```

### TypeScript

TypeScript configuration extends the shared config:

```json
{
  "extends": "@repo/shared-configs/typescript",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"]
    }
  }
}
```

### ESLint

ESLint configuration extends the shared Next.js config:

```js
module.exports = {
  extends: ['@repo/shared-configs/eslint-nextjs'],
  rules: {
    // Add custom rules here
  },
};
```

## Using Shared Packages

### Shared UI Components

```tsx
import { Button, Card, Input } from '@repo/shared-ui';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Shared Libraries

```tsx
import { validateEmail, formatDate, generateRandomId } from '@repo/shared-lib';

function MyComponent() {
  const isValid = validateEmail('user@example.com');
  const formatted = formatDate(new Date());
  const id = generateRandomId();
  
  return <div>{/* ... */}</div>;
}
```

### Shared Configurations

The app automatically uses shared configurations for:
- ESLint rules and plugins
- TypeScript compiler options
- Tailwind CSS theme and utilities
- Prettier formatting rules

## Styling

### CSS Variables

The app uses CSS variables for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}
```

### Dark Mode

Dark mode is supported through next-themes:

```tsx
import { ThemeProvider } from '@/components/ui/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Contributing

1. Follow the shared ESLint and Prettier configurations
2. Use shared UI components when possible
3. Add new utilities to the shared lib package
4. Update documentation for new features

## License

MIT
