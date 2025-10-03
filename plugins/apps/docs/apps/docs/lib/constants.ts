export const DOCS_CONFIG = {
  name: 'Documentation',
  description: 'Comprehensive documentation for the monorepo',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_DOCS_URL || 'http://localhost:3001',
} as const;

export const DOCS_ROUTES = {
  HOME: '/',
  GETTING_STARTED: '/docs/getting-started',
  COMPONENTS: '/docs/components',
  API: '/docs/api',
  PACKAGES: '/docs/packages',
} as const;
