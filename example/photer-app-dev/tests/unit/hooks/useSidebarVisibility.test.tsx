import { renderHook } from '@testing-library/react';
import { useSidebarVisibility } from '@/shared/hooks/useSidebarVisibility';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from 'next/navigation';

describe('🧪 useSidebarVisibility Hook', () => {
  const mockUsePathname = usePathname as jest.MockedFunction<
    typeof usePathname
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ Показ Sidebar на основных маршрутах', () => {
    test('должен показывать Sidebar на главной странице', () => {
      mockUsePathname.mockReturnValue('/');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(true);
      expect(result.current.isAuthPage).toBe(false);
      expect(result.current.pathname).toBe('/');
    });

    test('должен показывать Sidebar на странице профиля', () => {
      mockUsePathname.mockReturnValue('/profile');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(true);
      expect(result.current.isAuthPage).toBe(false);
      expect(result.current.pathname).toBe('/profile');
    });

    test('должен показывать Sidebar на странице поиска', () => {
      mockUsePathname.mockReturnValue('/search');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(true);
      expect(result.current.isAuthPage).toBe(false);
      expect(result.current.pathname).toBe('/search');
    });

    test('должен показывать Sidebar на вложенных маршрутах профиля', () => {
      mockUsePathname.mockReturnValue('/profile/123/post/456');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(true);
      expect(result.current.isAuthPage).toBe(false);
      expect(result.current.pathname).toBe('/profile/123/post/456');
    });
  });

  describe('❌ Скрытие Sidebar на страницах аутентификации', () => {
    test('должен скрывать Sidebar на странице входа', () => {
      mockUsePathname.mockReturnValue('/sign-in');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(false);
      expect(result.current.isAuthPage).toBe(true);
      expect(result.current.pathname).toBe('/sign-in');
    });

    test('должен скрывать Sidebar на странице регистрации', () => {
      mockUsePathname.mockReturnValue('/sign-up');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(false);
      expect(result.current.isAuthPage).toBe(true);
      expect(result.current.pathname).toBe('/sign-up');
    });

    test('должен скрывать Sidebar на странице восстановления пароля', () => {
      mockUsePathname.mockReturnValue('/forgot-password');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(false);
      expect(result.current.isAuthPage).toBe(true);
      expect(result.current.pathname).toBe('/forgot-password');
    });

    test('должен скрывать Sidebar на странице подтверждения email', () => {
      mockUsePathname.mockReturnValue('/confirm-email');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(false);
      expect(result.current.isAuthPage).toBe(true);
      expect(result.current.pathname).toBe('/confirm-email');
    });
  });

  describe('🔄 Обработка гидратации', () => {
    test('должен показывать Sidebar по умолчанию до гидратации', () => {
      mockUsePathname.mockReturnValue(undefined);

      const { result } = renderHook(() => useSidebarVisibility());

      // До гидратации (isClient = false) Sidebar показывается по умолчанию
      expect(result.current.showSidebar).toBe(true);
      expect(result.current.isClient).toBe(false);
      expect(result.current.pathname).toBe('/');
    });

    test('должен корректно обрабатывать состояние после гидратации', () => {
      mockUsePathname.mockReturnValue('/profile');

      const { result } = renderHook(() => useSidebarVisibility());

      // После гидратации (isClient = true) логика работает нормально
      expect(result.current.showSidebar).toBe(true);
      expect(result.current.isClient).toBe(true);
      expect(result.current.pathname).toBe('/profile');
    });
  });

  describe('🎯 Граничные случаи', () => {
    test('должен корректно обрабатывать пустой pathname', () => {
      mockUsePathname.mockReturnValue('');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(true); // По умолчанию показываем
      expect(result.current.pathname).toBe('/');
    });

    test('должен корректно обрабатывать null pathname', () => {
      mockUsePathname.mockReturnValue(null as any);

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(true); // По умолчанию показываем
      expect(result.current.pathname).toBe('/');
    });

    test('должен корректно обрабатывать undefined pathname', () => {
      mockUsePathname.mockReturnValue(undefined);

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(true); // По умолчанию показываем
      expect(result.current.pathname).toBe('/');
    });
  });

  describe('🔍 Детальная логика маршрутов', () => {
    test('должен корректно определять вложенные маршруты', () => {
      const testCases = [
        { path: '/profile/123', expected: true },
        { path: '/search?q=test', expected: true },
        { path: '/profile/123/settings', expected: true },
        { path: '/sign-in?redirect=/profile', expected: false },
        { path: '/sign-up?utm_source=google', expected: false },
      ];

      testCases.forEach(({ path, expected }) => {
        mockUsePathname.mockReturnValue(path);

        const { result } = renderHook(() => useSidebarVisibility());

        expect(result.current.showSidebar).toBe(expected);
        expect(result.current.pathname).toBe(path);
      });
    });

    test('должен корректно определять страницы аутентификации с параметрами', () => {
      const authPages = [
        '/sign-in?redirect=/profile',
        '/sign-up?utm_source=google',
        '/forgot-password?email=test@example.com',
        '/confirm-email?token=abc123',
        '/password-recovery?token=xyz789',
        '/resend-link?email=user@example.com',
        '/oauth?provider=google',
        '/terms-of-service?version=1.0',
        '/privacy-policy?locale=ru',
      ];

      authPages.forEach((path) => {
        mockUsePathname.mockReturnValue(path);

        const { result } = renderHook(() => useSidebarVisibility());

        expect(result.current.showSidebar).toBe(false);
        expect(result.current.isAuthPage).toBe(true);
        expect(result.current.pathname).toBe(path);
      });
    });
  });
});
