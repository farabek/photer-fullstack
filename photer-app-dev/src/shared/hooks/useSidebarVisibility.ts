import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCookie } from '@/shared/lib/cookies';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth/api/authApi';
import { RootState } from '@/shared/state/store';

// Memoized selector for auth user from RTK Query cache
const getMeSelector = authApi.endpoints.getMe.select();
const selectAuthData = createSelector([getMeSelector], (queryState) => ({
  data: queryState.data,
  isLoading: queryState.isLoading,
}));

/**
 * Хук для определения, должен ли показываться Sidebar на текущей странице
 * @returns {Object} Объект с информацией о видимости Sidebar
 */
export const useSidebarVisibility = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Получаем данные авторизации из RTK Query кэша (как в Sidebar)
  const authData = useSelector(selectAuthData);
  const { data, isLoading } = authData;

  // Обработка гидратации - определяем, когда компонент загружен на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Определяем авторизацию так же, как в Sidebar
  const isAuthenticated = isClient ? !!data : false;

  // Маршруты, где должен показываться Sidebar
  // Включаем все основные страницы приложения
  const sidebarRoutes = [
    '/',
    '/profile',
    '/search',
    '/create-post',
    '/messenger',
    '/statistics',
    '/favorites',
  ];

  // Проверяем, должен ли показываться Sidebar на текущем маршруте
  const showSidebar = sidebarRoutes.some(
    (route) =>
      pathname === route || (pathname && pathname.startsWith(`${route}/`))
  );

  // Определяем, является ли текущая страница auth страницей
  const isAuthPage =
    pathname &&
    (pathname.startsWith('/sign-in') ||
      pathname.startsWith('/sign-up') ||
      pathname.startsWith('/forgot-password') ||
      pathname.startsWith('/password-recovery') ||
      pathname.startsWith('/confirm-email') ||
      pathname.startsWith('/resend-link') ||
      pathname.startsWith('/oauth') ||
      pathname.startsWith('/terms-of-service') ||
      pathname.startsWith('/privacy-policy'));

  // Логика показа сайдбара:
  // - На главной странице ('/') показываем только для авторизованных пользователей
  // - На других страницах (profile, search, etc.) показываем всегда (как было раньше)
  // - На auth страницах не показываем никогда
  const shouldShowSidebar =
    isClient && pathname
      ? showSidebar &&
        !isAuthPage &&
        (pathname === '/' ? isAuthenticated : true)
      : showSidebar && !isAuthPage; // На сервере показываем по умолчанию, если не auth страница

  // Временное логирование для отладки
  if (typeof window !== 'undefined') {
    console.log('useSidebarVisibility Debug:', {
      pathname,
      isClient,
      isAuthenticated,
      hasData: !!data,
      isLoading,
      showSidebar,
      isAuthPage,
      shouldShowSidebar,
      routeCheck: pathname === '/' ? isAuthenticated : true,
    });
  }

  return {
    showSidebar: shouldShowSidebar,
    isAuthPage: isAuthPage || false,
    pathname: pathname || '/',
    isClient,
    isAuthenticated,
  };
};
