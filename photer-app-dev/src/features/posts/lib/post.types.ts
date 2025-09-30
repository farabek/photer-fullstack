import { PixelCrop } from './aspectRatios';

export type PostType = {
  id: string;
  description: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  status: boolean;
  photos: string[];
  latestPostId?: string; // Real post ID for virtual posts (for comments, etc.)
  owner: {
    userId: string;
    userName: string;
    avatarUrl: string | null;
    firstName: string | null;
    lastName: string | null;
  };
};

export type Posts = {
  items: PostType[];
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
};

export type CreationStep = 'upload' | 'crop' | 'filters' | 'description';

export type PhotoSettings = {
  url: string;
  crop: { x: number; y: number };
  zoom: number;
  rotation: number;
  croppedAreaPixels: PixelCrop | null;
  naturalAspect: number;
  filter?: string;
  cropRatio?: string;
  originalWidth?: number;
  originalHeight?: number;
  croppedWidth?: number;
  croppedHeight?: number;
  // надо сохранять чтобы откатываться
  originalUrl: string;
};

export type PostCreationState = {
  currentStep: CreationStep;
  photos: PhotoSettings[];
  currentPhotoIndex: number;
  description: string;
  tags: string[];
  error?: string;
};
export type PostCachedState = {
  cachedProfilePages: number;
  postCreated: boolean;
};

export type ErrorResponse = {
  error:
    | ErrorIncorrectValue
    | ErrorServerError
    | ErrorNotFound
    | ErrorNotOwner
    | ErrorUnauthorized;
};

type ErrorIncorrectValue = {
  status: 400;
  errorsMessage: [
    {
      message: string;
      field: string;
    },
  ];
};

type ErrorUnauthorized = {
  status: 401;
};

type ErrorNotOwner = {
  status: 403;
};

type ErrorNotFound = {
  status: 404;
};

type ErrorServerError = {
  status: 500;
  data: {
    message: string;
  };
};
