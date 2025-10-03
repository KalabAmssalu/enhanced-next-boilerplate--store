# @repo/web

The main web application for the enterprise monorepo, built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## Features

- **Next.js 14**: Latest version with App Router
- **React 18**: Modern React with concurrent features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Dark Mode**: Built-in theme support
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized for speed and SEO

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run e2e` - Run end-to-end tests
- `npm run e2e:ui` - Run E2E tests with UI

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── layout/         # Layout components
│   ├── sections/       # Page sections
│   └── ui/             # UI components
└── lib/                # Utility functions
    ├── constants.ts    # App constants
    └── utils.ts        # Utility functions
```

## Dependencies

### Core
- **Next.js 14**: React framework
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

### Shared Packages
- **@repo/shared-ui**: Shared UI components
- **@repo/shared-lib**: Utility functions
- **@repo/shared-configs**: Configuration files

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing
- **Playwright**: E2E testing

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
CUSTOM_KEY=your-custom-key
```

### Tailwind CSS

The app uses a shared Tailwind configuration from `@repo/shared-configs/tailwind`.

### TypeScript

TypeScript configuration extends the shared config with app-specific path mappings.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Docker

```bash
# Build Docker image
docker build -t enterprise-web .

# Run container
docker run -p 3000:3000 enterprise-web
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT


