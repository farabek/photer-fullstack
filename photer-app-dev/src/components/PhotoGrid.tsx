'use client';

import { useState } from 'react';
import { Photo } from '@/types/photo';
import { Trash2, Eye, Download, MoreVertical } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  onDelete: (photoId: string) => void;
}

export function PhotoGrid({ photos, onDelete }: PhotoGridProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const selectAll = () => {
    setSelectedPhotos(photos.map((photo) => photo.id));
  };

  const deselectAll = () => {
    setSelectedPhotos([]);
  };

  const deleteSelected = () => {
    selectedPhotos.forEach((photoId) => onDelete(photoId));
    setSelectedPhotos([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      {photos.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedPhotos.length} of {photos.length} selected
            </span>
            {selectedPhotos.length > 0 && (
              <button
                onClick={deleteSelected}
                className="flex items-center space-x-2 rounded-lg bg-red-500 px-3 py-1 text-white transition-colors hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Selected</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {selectedPhotos.length === photos.length ? (
              <button
                onClick={deselectAll}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Deselect All
              </button>
            ) : (
              <button
                onClick={selectAll}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Select All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            onMouseEnter={() => setHoveredPhoto(photo.id)}
            onMouseLeave={() => setHoveredPhoto(null)}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3 z-10">
              <input
                type="checkbox"
                checked={selectedPhotos.includes(photo.id)}
                onChange={() => togglePhotoSelection(photo.id)}
                className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2"
              />
            </div>

            {/* Photo */}
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={photo.url}
                alt={photo.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Overlay Actions */}
            {hoveredPhoto === photo.id && (
              <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center space-x-2 bg-black">
                <button className="bg-opacity-90 hover:bg-opacity-100 rounded-lg bg-white p-2 transition-all">
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
                <button className="bg-opacity-90 hover:bg-opacity-100 rounded-lg bg-white p-2 transition-all">
                  <Download className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={() => onDelete(photo.id)}
                  className="rounded-lg bg-red-500 p-2 text-white transition-all hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Photo Info */}
            <div className="p-4">
              <h3 className="mb-1 truncate font-medium text-gray-900">
                {photo.name}
              </h3>
              <div className="space-y-1 text-xs text-gray-500">
                <p>
                  {photo.width} × {photo.height}
                </p>
                <p>{formatFileSize(photo.size)}</p>
                <p>{formatDate(photo.uploadedAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {photos.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No photos yet
          </h3>
          <p className="text-gray-500">Upload some photos to get started!</p>
        </div>
      )}
    </div>
  );
}
