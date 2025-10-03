'use client';

import { Button } from '@repo/shared-ui';
import { Search } from '../search';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Documentation</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Search />
            <Button variant="ghost" size="sm">
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
