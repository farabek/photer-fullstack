export interface Photo {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  width: number;
  height: number;
  type: string;
  uploadedAt: Date;
  tags?: string[];
  description?: string;
  metadata?: PhotoMetadata;
}

export interface PhotoMetadata {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  focalLength?: number;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
}

export interface UploadProgress {
  photoId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface PhotoFilters {
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  type?: string[];
}
