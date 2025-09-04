'use client';

import { useEffect } from 'react';
import { useGetMeQuery } from '@/features/auth/api/authApi';
import { getCookie } from '@/shared/lib/cookies';

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

  // Предварительно загружаем данные пользователя только если есть токен
  useGetMeQuery(undefined, {
    skip: !hasToken, // Пропускаем запрос, если нет токена
  });

  return null; // Этот компонент не рендерит ничего видимого
}
