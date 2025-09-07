'use client';

import { useEffect, useRef } from 'react';
import { useGetMeQuery } from '@/features/auth/api/authApi';
import { getCookie } from '@/shared/lib/cookies';
import { appLogger } from '@/shared/lib/appLogger';
import { decodeJwt } from '@/shared/lib/decodeJwt';

/**
 * Компонент для предварительной загрузки данных пользователя
 *
 * Этот компонент автоматически загружает данные пользователя при инициализации приложения,
 * что обеспечивает правильное отображение состояния аутентификации в сайдбаре
 * и других компонентах при навигации между страницами.
 *
 * Оптимизация: запрос выполняется только если есть accessToken
 */
export function AuthInitializer() {
  // Проверяем наличие токена перед запросом
  const hasToken = getCookie('accessToken');
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Предварительно загружаем данные пользователя только если есть токен
  const { data, isLoading, error, isError } = useGetMeQuery(undefined, {
    skip: !hasToken, // Пропускаем запрос, если нет токена
  });

  // Логируем инициализацию компонента
  useEffect(() => {
    appLogger.auth('AUTH_INITIALIZER_MOUNTED', {
      hasToken: !!hasToken,
      tokenValue: hasToken ? 'exists' : 'null',
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Логируем изменения токена
  useEffect(() => {
    appLogger.auth('AUTH_INITIALIZER_TOKEN_CHANGED', {
      hasToken: !!hasToken,
      tokenValue: hasToken ? 'exists' : 'null',
      willSkipQuery: !hasToken,
      timestamp: new Date().toISOString(),
    });
  }, [hasToken]);

  // Логируем изменения в запросе getMe
  useEffect(() => {
    appLogger.auth('AUTH_INITIALIZER_QUERY_STATE_CHANGED', {
      hasToken: !!hasToken,
      hasData: !!data,
      dataUserId: data?.userId,
      dataEmail: data?.email,
      isLoading,
      hasError: !!error,
      isError,
      querySkipped: !hasToken,
      timestamp: new Date().toISOString(),
    });
  }, [data, isLoading, error, isError, hasToken]);

  // Проактивная ротация accessToken: планируем refresh за 10–15 сек до истечения
  useEffect(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    const token = getCookie('accessToken');
    if (!token) return;

    const payload = decodeJwt(token);
    if (!payload?.exp) return;

    const expMs = payload.exp * 1000; // exp в секундах
    const now = Date.now();
    const leadMs = 12_000; // за 12 секунд до истечения
    const delay = Math.max(expMs - now - leadMs, 0);

    refreshTimerRef.current = setTimeout(async () => {
      try {
        // Тихий refresh — бэкенд выставит Set-Cookie для новой пары токенов
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/v1/auth/refresh-token`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );
        appLogger.auth('PROACTIVE_REFRESH_DONE', {
          scheduledAt: new Date(now + delay).toISOString(),
          executedAt: new Date().toISOString(),
        });
      } catch (e) {
        appLogger.auth('PROACTIVE_REFRESH_FAILED', {
          error: (e as Error)?.message,
          executedAt: new Date().toISOString(),
        });
      }
    }, delay);

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [hasToken]);

  return null; // Этот компонент не рендерит ничего видимого
}
