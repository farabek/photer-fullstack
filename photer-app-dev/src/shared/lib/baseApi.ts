// src/shared/lib/baseApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['me', 'Posts', 'Profile'],
  // Глобальные настройки кэширования
  keepUnusedDataFor: 60, // Сохраняем неиспользуемые данные 60 секунд
  refetchOnMountOrArgChange: 30, // Перезапрашиваем данные при монтировании только если прошло 30 секунд
  refetchOnFocus: false, // Не перезапрашиваем при фокусе на окне
  refetchOnReconnect: true, // Перезапрашиваем при переподключении к интернету
});
