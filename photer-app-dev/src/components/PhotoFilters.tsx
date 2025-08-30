'use client';

import { useState } from 'react';
import { Filter, SortAsc, SortDesc, Grid, List } from 'lucide-react';
import { PhotoFilters } from '@/types/photo';

interface PhotoFiltersProps {
  filters: PhotoFilters;
  onFiltersChange: (filters: PhotoFilters) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: 'name' | 'date' | 'size' | 'type';
  onSortByChange: (sortBy: 'name' | 'date' | 'size' | 'type') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export function PhotoFilters({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: PhotoFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...(filters.tags || []), tag]
      : (filters.tags || []).filter((t) => t !== tag);

    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...(filters.type || []), type]
      : (filters.type || []).filter((t) => t !== type);

    onFiltersChange({ ...filters, type: newTypes });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Filters & Sort</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          {isExpanded ? 'Hide' : 'Show'} filters
        </button>
      </div>

      {/* View Mode & Sort */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`rounded-lg p-2 transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`rounded-lg p-2 transition-colors ${
              viewMode === 'list'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="focus:ring-primary-500 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
          </div>

          <button
            onClick={() =>
              onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
            }
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          {/* File Types */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-900">
              File Types
            </h4>
            <div className="flex flex-wrap gap-2">
              {['JPEG', 'PNG', 'GIF', 'WebP'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(filters.type || []).includes(type)}
                    onChange={(e) => handleTypeChange(type, e.target.checked)}
                    className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 bg-gray-100"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Range */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-900">
              File Size
            </h4>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min (MB)"
                className="focus:ring-primary-500 w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                onChange={(e) => {
                  const min = parseFloat(e.target.value);
                  onFiltersChange({
                    ...filters,
                    sizeRange: {
                      min: isNaN(min) ? undefined : min * 1024 * 1024,
                      max: filters.sizeRange?.max,
                    },
                  });
                }}
              />
              <span className="text-sm text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max (MB)"
                className="focus:ring-primary-500 w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                onChange={(e) => {
                  const max = parseFloat(e.target.value);
                  onFiltersChange({
                    ...filters,
                    sizeRange: {
                      min: filters.sizeRange?.min,
                      max: isNaN(max) ? undefined : max * 1024 * 1024,
                    },
                  });
                }}
              />
              <span className="text-sm text-gray-500">MB</span>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 underline hover:text-gray-800"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
