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
  // В dev используем прокси /api/* на next.config.ts (один origin: 3000)
  if (process.env.NODE_ENV === 'development') {
    return '/api/v1';
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

  console.log('🔄 [BASE_QUERY] Starting request:', {
    url: typeof args === 'string' ? args : args.url,
    method: typeof args === 'string' ? 'GET' : args.method || 'GET',
    hasAccessToken: !!getCookie('accessToken'),
    hasRefreshToken: !!getCookie('refreshToken'),
    timestamp: new Date().toISOString(),
  });

  let result = await baseQuery(args, api, extraOptions);

  // Если получили 401 (токен истек или недействителен)
  if (result.error && result.error.status === 401) {
    console.log('🔐 401 Error detected, attempting token refresh:', {
      url: typeof args === 'string' ? args : args.url,
      timestamp: new Date().toISOString(),
      error: result.error,
    });
    if (!mutex.isLocked()) {
      // Блокируем другие запросы от обновления токенов одновременно
      const release = await mutex.acquire();
      try {
        console.log('🔄 [REFRESH] Starting token refresh process');
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

        console.log('🔄 [REFRESH] Refresh result:', {
          hasData: !!refreshResult.data,
          hasError: !!refreshResult.error,
          errorStatus: refreshResult.error?.status,
          timestamp: new Date().toISOString(),
        });

        if (refreshResult.data) {
          console.log('✅ Token refresh successful, retrying original request');
          // Успешно обновили токены
          // Новый accessToken автоматически сохранился в обычный cookie от backend
          // Повторяем оригинальный запрос с новым токеном
          result = await baseQuery(args, api, extraOptions);
          console.log('✅ [REFRESH] Original request after refresh:', {
            success: !result.error,
            error: result.error,
            timestamp: new Date().toISOString(),
          });
        } else {
          console.log('❌ Token refresh failed (no data), clearing cookies:', {
            refreshError: refreshResult.error,
            hasAccessTokenBefore: !!getCookie('accessToken'),
            hasRefreshTokenBefore: !!getCookie('refreshToken'),
            timestamp: new Date().toISOString(),
          });
          // Не удалось обновить токены (refreshToken истек или недействителен)
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          console.log('🧹 Cookies cleared, dispatching invalidateTags');
          api.dispatch({
            type: 'baseApi/invalidateTags',
            payload: ['me'],
          });
          // 🆕 [UPDATE 1]: уведомление + редирект (только если не идет refresh)
          if (typeof window !== 'undefined' && !mutex.isLocked()) {
            alert('Сессия истекла, войдите снова');
            window.location.href = '/sign-in';
          }
        }

        // 🆕 [UPDATE 2]: проверка на refresh 401 → выходим из цикла
        if (refreshResult.error && refreshResult.error.status === 401) {
          console.log('⛔ Refresh token expired → force logout');
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          api.dispatch({ type: 'baseApi/invalidateTags', payload: ['me'] });

          // 🆕 [UPDATE 3]: уведомление + редирект
          if (typeof window !== 'undefined') {
            alert('Сессия истекла, войдите снова');
            window.location.href = '/sign-in';
          }

          return { error: refreshResult.error };
        }
      } finally {
        // Освобождаем блокировку
        release();
        console.log('🔄 [REFRESH] Mutex released');
      }
    } else {
      // Другой запрос уже обновляет токены, ждем
      console.log('🔄 [REFRESH] Another request is refreshing, waiting...');
      await mutex.waitForUnlock();
      console.log('🔄 [REFRESH] Mutex unlocked, retrying original request');
      result = await baseQuery(args, api, extraOptions);
      console.log('✅ [REFRESH] Original request after waiting:', {
        success: !result.error,
        error: result.error,
        timestamp: new Date().toISOString(),
      });
    }
  }

  console.log('🔄 [BASE_QUERY] Final result:', {
    url: typeof args === 'string' ? args : args.url,
    success: !result.error,
    error: result.error,
    timestamp: new Date().toISOString(),
  });

  return result;
};
