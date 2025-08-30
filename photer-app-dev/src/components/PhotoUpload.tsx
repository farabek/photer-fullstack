'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Photo } from '@/types/photo';
import { toast } from 'react-toastify';

interface PhotoUploadProps {
  onUpload: (photos: Photo[]) => void;
}

export function PhotoUpload({ onUpload }: PhotoUploadProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsUploading(true);

      const newPhotos: Photo[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        width: 0,
        height: 0,
        type: file.type,
        uploadedAt: new Date(),
      }));

      // Simulate getting image dimensions
      Promise.all(
        newPhotos.map((photo) => {
          return new Promise<Photo>((resolve) => {
            const img = new Image();
            img.onload = () => {
              resolve({
                ...photo,
                width: img.width,
                height: img.height,
              });
            };
            img.src = photo.url;
          });
        })
      ).then((photosWithDimensions) => {
        setUploadedPhotos((prev) => [...prev, ...photosWithDimensions]);
        onUpload(photosWithDimensions);
        setIsUploading(false);
        toast.success(
          `Successfully uploaded ${photosWithDimensions.length} photo(s)`
        );
      });
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: true,
  });

  const removePhoto = (photoId: string) => {
    setUploadedPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const clearAll = () => {
    setUploadedPhotos([]);
  };

  return (
    <div className="card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Upload Photos</h2>
        {uploadedPhotos.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <p className="mb-2 text-lg text-gray-600">
          {isDragActive ? 'Drop photos here' : 'Drag & drop photos here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to select files (JPEG, PNG, GIF, WebP)
        </p>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center space-x-2">
            <div className="border-primary-600 h-4 w-4 animate-spin rounded-full border-b-2"></div>
            <span className="text-sm text-blue-700">Processing photos...</span>
          </div>
        </div>
      )}

      {/* Uploaded Photos Preview */}
      {uploadedPhotos.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Uploaded Photos ({uploadedPhotos.length})
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {uploadedPhotos.map((photo) => (
              <div key={photo.id} className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="mt-2">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {photo.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(photo.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
