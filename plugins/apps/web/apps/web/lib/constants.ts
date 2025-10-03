export const APP_CONFIG = {
  name: 'Web App',
  description: 'A modern Next.js application',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const ROUTES = {
  HOME: '/',
  FEATURES: '/features',
  ABOUT: '/about',
  CONTACT: '/contact',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
} as const;
