import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Хук для определения, должен ли показываться Sidebar на текущей странице
 * @returns {Object} Объект с информацией о видимости Sidebar
 */
export const useSidebarVisibility = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Обработка гидратации - определяем, когда компонент загружен на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Маршруты, где должен показываться Sidebar
  // Включаем только существующие страницы в проекте
  // TODO: Когда будут созданы новые страницы, добавить их сюда:
  // - '/create-post' - страница создания поста
  // - '/messenger' - страница мессенджера
  // - '/statistics' - страница статистики
  // - '/favorites' - страница избранного
  const sidebarRoutes = ['/', '/profile', '/search'];

  // Проверяем, должен ли показываться Sidebar на текущем маршруте
  const showSidebar = sidebarRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
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

  // Если мы на клиенте и pathname определен, используем обычную логику
  // Если мы на сервере или pathname не определен, показываем Sidebar по умолчанию
  // (предполагая, что это главная страница)
  const shouldShowSidebar =
    isClient && pathname ? showSidebar && !isAuthPage : true; // Показываем по умолчанию при первой отрисовке

  // Если pathname не определен, оставляем shouldShowSidebar = true (показываем по умолчанию)

  return {
    showSidebar: shouldShowSidebar,
    isAuthPage: isAuthPage || false,
    pathname: pathname || '/',
    isClient,
  };
};
