'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@repo/shared-ui';
import { Navigation } from './navigation';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary" />
            <span className="text-xl font-bold">Enterprise</span>
          </Link>
        </div>

        <Navigation className="hidden md:flex" />

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button size="sm" className="hidden sm:inline-flex">
            Get Started
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <Navigation className="flex flex-col space-y-2 p-4" />
        </div>
      )}
    </header>
  );
}


