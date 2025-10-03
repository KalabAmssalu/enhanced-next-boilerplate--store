'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@repo/shared-lib';
import { Button } from '@repo/shared-ui';

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/getting-started' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Configuration', href: '/docs/configuration' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Button', href: '/docs/components/button' },
      { title: 'Card', href: '/docs/components/card' },
      { title: 'Input', href: '/docs/components/input' },
      { title: 'Dialog', href: '/docs/components/dialog' },
    ],
  },
  {
    title: 'API',
    items: [
      { title: 'Authentication', href: '/docs/api/auth' },
      { title: 'Users', href: '/docs/api/users' },
      { title: 'Files', href: '/docs/api/files' },
    ],
  },
  {
    title: 'Deployment',
    items: [
      { title: 'Vercel', href: '/docs/deployment/vercel' },
      { title: 'Docker', href: '/docs/deployment/docker' },
      { title: 'AWS', href: '/docs/deployment/aws' },
    ],
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={cn(
      'bg-card border-r transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="text-lg font-bold">Docs</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '→' : '←'}
          </Button>
        </div>

        <nav className="space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-3 py-2 text-sm rounded-md transition-colors',
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}


