'use client';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { Mutex } from 'async-mutex';
import { getCookie, deleteCookie } from './cookies';

/**
 * Mutex для предотвращения одновременных refresh token запросов
 * Это важно, чтобы избежать race conditions при обновлении токенов
 */
const mutex = new Mutex();

/**
 * Определяет базовый URL для API в зависимости от окружения
 *
 * Архитектура аутентификации:
 * - accessToken: обычный cookie (не httpOnly) - JavaScript может читать для добавления в Authorization header
 * - refreshToken: httpOnly cookie - защищен от XSS атак, используется только для обновления
 *
 * Почему accessToken не httpOnly:
 * 1. JavaScript должен читать токен для добавления в Authorization header
 * 2. Без этого все API запросы будут возвращать 401 Unauthorized
 * 3. Короткий срок жизни (60 сек) + автоматическое обновление обеспечивают безопасность
 */
const getBaseUrl = () => {
  // Проверяем, находимся ли мы в режиме разработки
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api/v1';
  }

  // Для продакшена используем переменную окружения
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://photer.ltd/api/v1';
};

/**
 * Базовый query для RTK Query с поддержкой аутентификации
 *
 * Ключевые особенности:
 * - credentials: 'include' - отправляет cookies с каждым запросом
 * - prepareHeaders - добавляет Authorization header с accessToken из cookie
 * - Поддержка SSR - cookies доступны как на клиенте, так и на сервере
 */
const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  credentials: 'include', // Важно для отправки cookies
  prepareHeaders: (headers) => {
    // Получаем accessToken из обычного cookie (не httpOnly)
    // JavaScript может читать этот токен для добавления в Authorization header
    const token = getCookie('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Логируем для отладки
console.log('baseQuery configured with baseUrl:', getBaseUrl());

/**
 * Расширенный baseQuery с автоматическим обновлением токенов
 *
 * Логика работы:
 * 1. Делает оригинальный запрос
 * 2. Если получает 401 (токен истек):
 *    - Пытается обновить токены через /auth/refresh-token
 *    - refreshToken автоматически отправляется в httpOnly cookie
 *    - Новый accessToken устанавливается в обычный cookie
 *    - Повторяет оригинальный запрос с новым токеном
 * 3. Если refresh не удался - очищает cookies (logout)
 *
 * Безопасность:
 * - refreshToken в httpOnly cookie защищен от XSS
 * - accessToken короткий срок жизни (60 сек)
 * - Mutex предотвращает race conditions
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Ждем, если другой запрос обновляет токены
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  // Если получили 401 (токен истек или недействителен)
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      // Блокируем другие запросы от обновления токенов одновременно
      const release = await mutex.acquire();
      try {
        // Пытаемся обновить токены
        // refreshToken автоматически отправляется в httpOnly cookie
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh-token',
            method: 'POST',
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Успешно обновили токены
          // Новый accessToken автоматически сохранился в обычный cookie от backend
          // Повторяем оригинальный запрос с новым токеном
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Не удалось обновить токены (refreshToken истек или недействителен)
          // Очищаем cookies - пользователь должен войти заново
          deleteCookie('accessToken');
          deleteCookie('refreshToken');

          // Очищаем кэш RTK Query для данных пользователя
          // Это важно для правильного отображения состояния аутентификации
          // Используем универсальный подход для инвалидации тега 'me'
          api.dispatch({
            type: 'baseApi/invalidateTags',
            payload: ['me'],
          });
        }
      } finally {
        // Освобождаем блокировку
        release();
      }
    } else {
      // Другой запрос уже обновляет токены, ждем
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
