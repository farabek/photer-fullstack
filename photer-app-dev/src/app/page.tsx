'use client';

import { useState } from 'react';
import { PhotoUpload } from '@/components/PhotoUpload';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoFilters } from '@/components/PhotoFilters';
import { Header } from '@/components/Header';
import { Photo, PhotoFilters as PhotoFiltersType } from '@/types/photo';

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filters, setFilters] = useState<PhotoFiltersType>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>(
    'date'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handlePhotoUpload = (newPhotos: Photo[]) => {
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handlePhotoDelete = (photoId: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Welcome to Photer App
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Professional photo management and editing application. Upload,
              organize, and edit your photos with ease.
            </p>
          </div>

          <PhotoUpload onUpload={handlePhotoUpload} />

          {photos.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                Your Photos ({photos.length})
              </h2>

              <PhotoFilters
                filters={filters}
                onFiltersChange={setFilters}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
              />

              <PhotoGrid photos={photos} onDelete={handlePhotoDelete} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
