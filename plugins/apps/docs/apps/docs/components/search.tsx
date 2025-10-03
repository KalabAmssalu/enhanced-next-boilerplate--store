'use client';

import { useState } from 'react';
import { Input } from '@repo/shared-ui';

export function Search() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search documentation..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-64"
      />
    </div>
  );
}
