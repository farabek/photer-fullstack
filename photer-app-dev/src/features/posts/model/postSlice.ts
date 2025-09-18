import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CreationStep,
  PhotoSettings,
  PostCachedState,
  PostCreationState,
} from '../lib/post.types';

// начальный стейт в photos массив фоток с настройками
const initialState: PostCreationState & PostCachedState = {
  currentStep: 'upload',
  photos: [],
  currentPhotoIndex: 0,
  description: '',
  cachedProfilePages: 0,
};

const postSlice = createSlice({
  name: 'post',
  // начальный стейт в photos массив фоток с настройками...
  initialState,
  reducers: {
    // ... и шаг, текущая модалка
    goToStep: (state, action: PayloadAction<CreationStep>) => {
      state.currentStep = action.payload;
    },

    // загружаем фото и шаг ставим первый
    addPhotos: (
      state,
      action: PayloadAction<Omit<PhotoSettings, 'originalUrl'>[]>
    ) => {
      console.log('🔄 Redux addPhotos reducer called with:', action.payload);
      console.log('📊 Payload length:', action.payload.length);
      console.log('📊 First photo sample:', action.payload[0]);

      const photosWithDefaults = action.payload.map((photo, index) => {
        const photoWithDefaults = {
          ...photo,
          cropRatio: 'Original' as const,
          originalUrl: photo.url,
        };
        console.log(`📷 Photo ${index} with defaults:`, {
          url: photoWithDefaults.url,
          originalUrl: photoWithDefaults.originalUrl,
          cropRatio: photoWithDefaults.cropRatio
        });
        return photoWithDefaults;
      });

      console.log('📷 Photos with defaults:', photosWithDefaults);
      state.photos = [...state.photos, ...photosWithDefaults];
      state.currentStep = 'crop';

      console.log('✅ Redux state updated:', {
        photos: state.photos.length,
        step: state.currentStep,
        photosArray: state.photos.map(p => ({ url: p.url, originalUrl: p.originalUrl }))
      });
    },

    // выбираем определенной фото по индексу...
    setCurrentPhotoIndex: (state, action: PayloadAction<number>) => {
      state.currentPhotoIndex = action.payload;
    },

    // ... и добавляем ему изменения
    setPhotoSettings: (
      state,
      action: PayloadAction<Partial<PhotoSettings>>
    ) => {
      const currentPhoto = state.photos[state.currentPhotoIndex];
      if (currentPhoto) {
        state.photos[state.currentPhotoIndex] = {
          ...currentPhoto,
          ...action.payload,
        };
      }
    },

    // новый редьюсер для сброса фильтра
    resetPhotoFilter: (state) => {
      const currentPhoto = state.photos[state.currentPhotoIndex];
      if (currentPhoto) {
        state.photos[state.currentPhotoIndex] = {
          ...currentPhoto,
          url: currentPhoto.originalUrl, // возвращаем исходный URL
          filter: undefined,
        };
      }
    },

    deletePhoto: (state, action: PayloadAction<number>) => {
      state.photos.splice(action.payload, 1);
    },
    // обрезка
    setCroppedImage: (state, action: PayloadAction<string>) => {
      const idx = state.currentPhotoIndex;
      state.photos[idx] = {
        ...state.photos[idx],
        url: action.payload,
      };
    },

    // новый для сброса обрезки
    resetPhotoCrop: (state) => {
      const currentPhoto = state.photos[state.currentPhotoIndex];
      if (currentPhoto) {
        state.photos[state.currentPhotoIndex] = {
          ...currentPhoto,
          url: currentPhoto.originalUrl, // возвращаем исходный URL
          croppedAreaPixels: null, // сбрасываем данные обрезки
          zoom: 1,
          rotation: 0,
        };
      }
    },
    resetState: () => initialState,

    // указатель закешированных страниц профиля
    cachedProfilePages: (state, action) => {
      state.cachedProfilePages = action.payload;
    },
  },
});

export const {
  goToStep,
  setCurrentPhotoIndex,
  setPhotoSettings,
  addPhotos,
  setCroppedImage,
  deletePhoto,
  resetState,
  resetPhotoFilter,
  resetPhotoCrop,
  cachedProfilePages,
} = postSlice.actions;

export const postReducer = postSlice.reducer;
