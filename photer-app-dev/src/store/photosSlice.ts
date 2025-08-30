import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Photo, PhotoFilters } from '@/types/photo';

interface PhotosState {
  photos: Photo[];
  selectedPhotos: string[];
  filters: PhotoFilters;
  isLoading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
}

const initialState: PhotosState = {
  photos: [],
  selectedPhotos: [],
  filters: {},
  isLoading: false,
  error: null,
  viewMode: 'grid',
  sortBy: 'date',
  sortOrder: 'desc',
};

const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    setPhotos: (state, action: PayloadAction<Photo[]>) => {
      state.photos = action.payload;
    },
    addPhoto: (state, action: PayloadAction<Photo>) => {
      state.photos.push(action.payload);
    },
    addPhotos: (state, action: PayloadAction<Photo[]>) => {
      state.photos.push(...action.payload);
    },
    removePhoto: (state, action: PayloadAction<string>) => {
      state.photos = state.photos.filter(
        (photo) => photo.id !== action.payload
      );
      state.selectedPhotos = state.selectedPhotos.filter(
        (id) => id !== action.payload
      );
    },
    updatePhoto: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Photo> }>
    ) => {
      const index = state.photos.findIndex(
        (photo) => photo.id === action.payload.id
      );
      if (index !== -1) {
        state.photos[index] = {
          ...state.photos[index],
          ...action.payload.updates,
        };
      }
    },
    setSelectedPhotos: (state, action: PayloadAction<string[]>) => {
      state.selectedPhotos = action.payload;
    },
    togglePhotoSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedPhotos.indexOf(action.payload);
      if (index === -1) {
        state.selectedPhotos.push(action.payload);
      } else {
        state.selectedPhotos.splice(index, 1);
      }
    },
    setFilters: (state, action: PayloadAction<PhotoFilters>) => {
      state.filters = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<'name' | 'date' | 'size' | 'type'>
    ) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setPhotos,
  addPhoto,
  addPhotos,
  removePhoto,
  updatePhoto,
  setSelectedPhotos,
  togglePhotoSelection,
  setFilters,
  setViewMode,
  setSortBy,
  setSortOrder,
  setLoading,
  setError,
  clearError,
} = photosSlice.actions;

export default photosSlice.reducer;
