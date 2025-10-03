export const DOCS_CONFIG = {
  name: 'Enterprise Documentation',
  description: 'Comprehensive documentation for the Enterprise platform',
  url: process.env.NEXT_PUBLIC_DOCS_URL || 'http://localhost:3001',
  version: '1.0.0',
} as const;

export const DOCS_ROUTES = {
  HOME: '/',
  GETTING_STARTED: '/docs/getting-started',
  COMPONENTS: '/docs/components',
  API: '/docs/api',
  DEPLOYMENT: '/docs/deployment',
  CONTRIBUTING: '/docs/contributing',
  TROUBLESHOOTING: '/docs/troubleshooting',
} as const;


