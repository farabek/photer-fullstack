'use client';

import { useState } from 'react';
import { Photo } from '@/types/photo';
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/utils';

interface PhotoViewerProps {
  photo: Photo;
  onClose: () => void;
}

export function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const zoomIn = () => setScale((prev) => Math.min(prev * 1.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev / 1.2, 0.5));
  const rotate = () => setRotation((prev) => (prev + 90) % 360);
  const reset = () => {
    setScale(1);
    setRotation(0);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="relative flex h-full w-full flex-col">
        {/* Header */}
        <div className="bg-opacity-50 flex items-center justify-between bg-black p-4 text-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-medium">{photo.name}</h2>
            <span className="text-sm text-gray-300">
              {photo.width} × {photo.height}
            </span>
            <span className="text-sm text-gray-300">
              {formatFileSize(photo.size)}
            </span>
            <span className="text-sm text-gray-300">
              {formatDate(photo.uploadedAt)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="hover:bg-opacity-20 rounded-lg p-2 hover:bg-white disabled:opacity-50"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="min-w-[60px] text-center text-sm">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= 3}
              className="hover:bg-opacity-20 rounded-lg p-2 hover:bg-white disabled:opacity-50"
            >
              <button
                onClick={rotate}
                className="hover:bg-opacity-20 rounded-lg p-2 hover:bg-white"
              >
                <RotateCw className="h-5 w-5" />
              </button>
            </button>
            <button
              onClick={reset}
              className="hover:bg-opacity-20 rounded-lg p-2 hover:bg-white"
            >
              <span className="text-sm">Reset</span>
            </button>
            <button
              onClick={handleDownload}
              className="hover:bg-opacity-20 rounded-lg p-2 hover:bg-white"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="hover:bg-opacity-20 rounded-lg p-2 hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <div
            className="relative transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={photo.url}
              alt={photo.name}
              className="max-h-none max-w-none select-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-opacity-50 bg-black p-4 text-center text-white">
          <p className="text-sm text-gray-300">
            Use mouse wheel to zoom, drag to pan, or use the controls above
          </p>
        </div>
      </div>
    </div>
  );
}
