'use client';

import { Button } from '@repo/shared-ui';

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Navigation() {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navigationItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          size="sm"
          asChild
        >
          <a href={item.href}>{item.label}</a>
        </Button>
      ))}
    </nav>
  );
}
