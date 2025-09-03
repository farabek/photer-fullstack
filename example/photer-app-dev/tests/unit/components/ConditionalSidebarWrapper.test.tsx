import { render, screen } from '@testing-library/react';
import { ConditionalSidebarWrapper } from '@/app/ConditionalSidebarWrapper';

// Mock хука useSidebarVisibility
jest.mock('@/shared/hooks/useSidebarVisibility', () => ({
  useSidebarVisibility: jest.fn(),
}));

// Mock компонента Sidebar
jest.mock('@/widgets/side-bar', () => ({
  Sidebar: () => <div data-testid="sidebar">Mock Sidebar</div>,
}));

import { useSidebarVisibility } from '@/shared/hooks/useSidebarVisibility';

describe('🧪 ConditionalSidebarWrapper Component', () => {
  const mockUseSidebarVisibility = useSidebarVisibility as jest.MockedFunction<
    typeof useSidebarVisibility
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ Отображение Sidebar', () => {
    test('должен показывать Sidebar когда showSidebar = true', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true,
        isAuthPage: false,
        pathname: '/',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByText('Mock Sidebar')).toBeInTheDocument();
    });

    test('должен показывать Sidebar на главной странице', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true,
        isAuthPage: false,
        pathname: '/',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('должен показывать Sidebar на странице профиля', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true,
        isAuthPage: false,
        pathname: '/profile',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('должен показывать Sidebar на странице поиска', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true,
        isAuthPage: false,
        pathname: '/search',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  describe('❌ Скрытие Sidebar', () => {
    test('должен скрывать Sidebar когда showSidebar = false', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: false,
        isAuthPage: true,
        pathname: '/sign-in',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
      expect(screen.queryByText('Mock Sidebar')).not.toBeInTheDocument();
    });

    test('должен скрывать Sidebar на странице входа', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: false,
        isAuthPage: true,
        pathname: '/sign-in',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    test('должен скрывать Sidebar на странице регистрации', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: false,
        isAuthPage: true,
        pathname: '/sign-up',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    test('должен скрывать Sidebar на странице восстановления пароля', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: false,
        isAuthPage: true,
        pathname: '/forgot-password',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });
  });

  describe('🔄 Обработка гидратации', () => {
    test('должен корректно работать до гидратации (isClient = false)', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true, // По умолчанию показываем
        isAuthPage: false,
        pathname: '/',
        isClient: false,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('должен корректно работать после гидратации (isClient = true)', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true,
        isAuthPage: false,
        pathname: '/',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  describe('🎯 Граничные случаи', () => {
    test('должен корректно обрабатывать undefined pathname', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true, // По умолчанию показываем
        isAuthPage: false,
        pathname: undefined as any,
        isClient: false,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('должен корректно обрабатывать пустой pathname', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true, // По умолчанию показываем
        isAuthPage: false,
        pathname: '',
        isClient: false,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('должен корректно обрабатывать null pathname', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true, // По умолчанию показываем
        isAuthPage: false,
        pathname: null as any,
        isClient: false,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  describe('🔍 Детальная логика маршрутов', () => {
    test('должен корректно обрабатывать вложенные маршруты профиля', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true,
        isAuthPage: false,
        pathname: '/profile/123/post/456',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('должен корректно обрабатывать маршруты с параметрами', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true,
        isAuthPage: false,
        pathname: '/search?q=test&category=photos',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('должен корректно обрабатывать страницы аутентификации с параметрами', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: false,
        isAuthPage: true,
        pathname: '/sign-in?redirect=/profile&utm_source=google',
        isClient: true,
      });

      render(<ConditionalSidebarWrapper />);

      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });
  });

  describe('📱 Адаптивность и рендеринг', () => {
    test('должен корректно рендериться без ошибок', () => {
      mockUseSidebarVisibility.mockReturnValue({
        showSidebar: true,
        isAuthPage: false,
        pathname: '/',
        isClient: true,
      });

      expect(() => {
        render(<ConditionalSidebarWrapper />);
      }).not.toThrow();
    });

    test('должен корректно работать с разными состояниями хука', () => {
      const testCases = [
        { showSidebar: true, isAuthPage: false, pathname: '/', isClient: true },
        {
          showSidebar: false,
          isAuthPage: true,
          pathname: '/sign-in',
          isClient: true,
        },
        {
          showSidebar: true,
          isAuthPage: false,
          pathname: '/profile',
          isClient: true,
        },
        {
          showSidebar: false,
          isAuthPage: true,
          pathname: '/sign-up',
          isClient: true,
        },
      ];

      testCases.forEach((testCase) => {
        mockUseSidebarVisibility.mockReturnValue(testCase);

        const { unmount } = render(<ConditionalSidebarWrapper />);

        if (testCase.showSidebar) {
          expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
        }

        unmount();
      });
    });
  });
});
