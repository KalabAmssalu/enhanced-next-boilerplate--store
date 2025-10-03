'use client';

import { Button } from '@repo/shared-ui';

const navigationItems = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/docs/getting-started' },
      { label: 'Installation', href: '/docs/getting-started/installation' },
      { label: 'Configuration', href: '/docs/getting-started/configuration' },
    ],
  },
  {
    title: 'Components',
    items: [
      { label: 'Overview', href: '/docs/components' },
      { label: 'Button', href: '/docs/components/button' },
      { label: 'Card', href: '/docs/components/card' },
      { label: 'Input', href: '/docs/components/input' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { label: 'Overview', href: '/docs/api' },
      { label: 'Authentication', href: '/docs/api/auth' },
      { label: 'Users', href: '/docs/api/users' },
    ],
  },
  {
    title: 'Packages',
    items: [
      { label: 'Shared UI', href: '/docs/packages/shared-ui' },
      { label: 'Shared Configs', href: '/docs/packages/shared-configs' },
      { label: 'Shared Lib', href: '/docs/packages/shared-lib' },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-background border-r border-border p-6">
      <div className="space-y-6">
        {navigationItems.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <a href={item.href}>{item.label}</a>
                </Button>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
