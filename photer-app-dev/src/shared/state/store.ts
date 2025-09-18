// src/shared/state/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux';

import { baseApi } from '@/shared/lib/baseApi';
import { modalReducer } from './slices/modalSlice';
import { postReducer } from '@/features/posts/model/postSlice';
import { countryApi } from '@/features/edit-profile/api/countryApi';
import { genInfoReducer } from '@/features/edit-profile/model/genInfoSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    post: postReducer,
    genInfo: genInfoReducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer, // ⬅ все endpoints подключаются сюда через injectEndpoints
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false, // <- отключили "тяжёлую" проверку
    }).concat(baseApi.middleware, countryApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

setupListeners(store.dispatch);
