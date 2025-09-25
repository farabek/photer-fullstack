// Mock all dependencies before importing the hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  createSelector: jest.fn(() =>
    jest.fn(() => ({ data: null, isLoading: false }))
  ),
}));

jest.mock('@/features/auth/api/authApi', () => ({
  authApi: {
    endpoints: {
      getMe: {
        select: jest.fn(() =>
          jest.fn(() => ({
            data: null,
            isLoading: false,
            isError: false,
            isSuccess: false,
            error: null,
            fulfilledTimeStamp: 0,
            startedTimeStamp: 0,
            status: 'uninitialized',
          }))
        ),
      },
    },
  },
}));

import { renderHook } from '@testing-library/react';
import { useSidebarVisibility } from '@/shared/hooks/useSidebarVisibility';
import { usePathname } from 'next/navigation';
import { useSelector, createSelector } from 'react-redux';
import { authApi } from '@/features/auth/api/authApi';

describe('🧪 useSidebarVisibility Hook', () => {
  const mockUsePathname = usePathname as jest.MockedFunction<
    typeof usePathname
  >;
  const mockUseSelector = useSelector as jest.MockedFunction<
    typeof useSelector
  >;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePathname.mockReturnValue('/');
    mockUseSelector.mockReturnValue({ data: null, isLoading: false });
  });

  describe('✅ Показ Sidebar на основных маршрутах', () => {
    test('должен показывать Sidebar на главной странице для авторизованных пользователей', () => {
      mockUsePathname.mockReturnValue('/');
      mockUseSelector.mockReturnValue({
        data: { id: '123', email: 'test@example.com' },
        isLoading: false,
      });

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(true);
      expect(result.current.isAuthPage).toBe(false);
      expect(result.current.pathname).toBe('/');
      expect(result.current.isAuthenticated).toBe(true);
    });

    test('должен скрывать Sidebar на главной странице для неавторизованных пользователей', () => {
      mockUsePathname.mockReturnValue('/');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(false);
      expect(result.current.isAuthPage).toBe(false);
      expect(result.current.pathname).toBe('/');
      expect(result.current.isAuthenticated).toBe(false);
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
    test('должен скрывать Sidebar на главной странице до гидратации (неавторизованный пользователь)', () => {
      mockUsePathname.mockReturnValue('/');

      const { result } = renderHook(() => useSidebarVisibility());

      // До гидратации (isClient = false) используем серверную логику - скрываем для главной страницы
      expect(result.current.showSidebar).toBe(false); // Главная страница без авторизации скрыта
      expect(result.current.isClient).toBe(true); // Хук использует useEffect для установки isClient
      expect(result.current.pathname).toBe('/');
      expect(result.current.isAuthenticated).toBe(false);
    });

    test('должен корректно обрабатывать состояние после гидратации', () => {
      mockUsePathname.mockReturnValue('/profile');

      const { result } = renderHook(() => useSidebarVisibility());

      // После гидратации (isClient = true) логика работает нормально
      expect(result.current.showSidebar).toBe(true);
      expect(result.current.isClient).toBe(true);
      expect(result.current.pathname).toBe('/profile');
      expect(result.current.isAuthenticated).toBe(false);
    });

    test('должен показывать Sidebar после гидратации для авторизованного пользователя на главной', () => {
      mockUsePathname.mockReturnValue('/');
      mockUseSelector.mockReturnValue({
        data: { id: '123', email: 'test@example.com' },
        isLoading: false,
      });

      const { result } = renderHook(() => useSidebarVisibility());

      // После гидратации должен показать Sidebar для авторизованного пользователя
      expect(result.current.showSidebar).toBe(true);
      expect(result.current.isClient).toBe(true);
      expect(result.current.pathname).toBe('/');
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('🎯 Граничные случаи', () => {
    test('должен корректно обрабатывать пустой pathname', () => {
      mockUsePathname.mockReturnValue('');

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(false); // Пустой pathname не соответствует ни одному маршруту
      expect(result.current.pathname).toBe('/'); // Возвращается fallback
    });

    test('должен корректно обрабатывать null pathname', () => {
      mockUsePathname.mockReturnValue(null as any);

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(false); // null не соответствует маршрутам
      expect(result.current.pathname).toBe('/'); // Возвращается fallback
    });

    test('должен корректно обрабатывать undefined pathname', () => {
      mockUsePathname.mockReturnValue(undefined);

      const { result } = renderHook(() => useSidebarVisibility());

      expect(result.current.showSidebar).toBe(false); // undefined не соответствует маршрутам
      expect(result.current.pathname).toBe('/'); // Возвращается fallback
    });
  });

  describe('🔍 Детальная логика маршрутов', () => {
    test('должен корректно определять вложенные маршруты', () => {
      const testCases = [
        { path: '/profile/123', expected: true }, // profile route
        { path: '/search?q=test', expected: false }, // search route без параметров
        { path: '/profile/123/settings', expected: true }, // profile route
        { path: '/sign-in?redirect=/profile', expected: false }, // auth page
        { path: '/sign-up?utm_source=google', expected: false }, // auth page
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
