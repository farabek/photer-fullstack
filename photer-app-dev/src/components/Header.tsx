'use client';

import { useState } from 'react';
import { Search, Grid, List, Settings, User } from 'lucide-react';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Photer</h1>
          </div>

          {/* Search */}
          <div className="mx-8 max-w-md flex-1">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-primary-500 w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <Grid className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <List className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <Settings className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
