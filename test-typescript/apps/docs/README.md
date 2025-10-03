# @repo/docs

The documentation site for the Enterprise platform, built with Next.js 14, MDX, and Tailwind CSS.

## Features

- **Next.js 14**: Latest version with App Router
- **MDX Support**: Write documentation with JSX components
- **Dark Mode**: Built-in theme support
- **Search**: Built-in search functionality
- **Responsive Design**: Mobile-first approach
- **Syntax Highlighting**: Code blocks with syntax highlighting
- **Navigation**: Collapsible sidebar navigation

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

Open [http://localhost:3001](http://localhost:3001) to view the documentation.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── layout/         # Layout components
│   └── search.tsx      # Search component
├── content/            # MDX content files
│   └── docs/           # Documentation pages
└── lib/                # Utility functions
    ├── constants.ts    # App constants
    └── utils.ts        # Utility functions
```

## Writing Documentation

### MDX Files

Documentation is written in MDX format, which allows you to use JSX components within Markdown:

```mdx
# My Documentation

This is a regular markdown paragraph.

<Button>This is a React component!</Button>

```tsx
// Code blocks with syntax highlighting
function MyComponent() {
  return <div>Hello World</div>;
}
```
```

### File Organization

- Place MDX files in the `content/docs/` directory
- Use kebab-case for file names
- Organize files in subdirectories for better navigation

### Frontmatter

You can add frontmatter to MDX files for metadata:

```mdx
---
title: "My Documentation"
description: "A description of this page"
---

# My Documentation

Content goes here...
```

## Styling

The documentation site uses Tailwind CSS with custom styles for MDX content. The prose styles are defined in `globals.css` and provide:

- Typography styles for headings, paragraphs, lists
- Code block styling with syntax highlighting
- Table styling
- Blockquote styling

## Search

The documentation includes a search component that can be extended to search through all documentation pages. Currently, it's a basic implementation that can be enhanced with:

- Full-text search
- Search indexing
- Search suggestions
- Search analytics

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Docker

```bash
# Build Docker image
docker build -t enterprise-docs .

# Run container
docker run -p 3001:3001 enterprise-docs
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
2. Add or update documentation
3. Test your changes locally
4. Submit a pull request

## License

MIT


