import React from 'react';
import { Filter } from './filters';
import Image from 'next/image';

export type FilterGridProps = {
  filters: Filter[];
  currentFilter: string;
  currentPhotoUrl: string;
  onFilterChange: (filterName: string) => void;
};

export function FiltersGrid({
  filters,
  currentFilter,
  currentPhotoUrl,
  onFilterChange,
}: FilterGridProps): React.ReactElement {
  return (
    <div className="mt-4 w-full">
      <div className="grid grid-cols-3 gap-4">
        {filters.map((filter) => (
          <div
            key={filter.name}
            className="flex cursor-pointer flex-col items-center"
            onClick={() => onFilterChange(filter.name)}
          >
            <div
              className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${
                currentFilter === filter.name
                  ? 'border-accent-500'
                  : 'border-transparent'
              }`}
            >
              <Image
                src={currentPhotoUrl || '/placeholder.svg'}
                alt={filter.name}
                className={`h-full w-full object-cover ${filter.className}`}
                width={1000}
                height={1000}
                unoptimized
              />
            </div>
            <span className="text-light-100 mt-1 text-sm">{filter.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
