'use client';

import { Button } from '@repo/shared-ui';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Documentation</h1>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}


