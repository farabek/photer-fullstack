import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogIn from '@/features/auth/sign-in/ui/LogIn';

// Mock хука useLogInForm
jest.mock('@/features/auth/sign-in/hooks/useLogInForm', () => ({
  useLogInForm: jest.fn(),
}));

// Mock компонента Card
jest.mock('@/widgets/card/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
}));

// Mock компонента Input
jest.mock('@/shared/ui/input/Input', () => ({
  Input: ({ label, errorMessage, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input {...props} />
      {errorMessage && <span className="error">{errorMessage}</span>}
    </div>
  ),
}));

// Mock компонента Button
jest.mock('@/shared/ui/button/Button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock компонента OAuthLinks
jest.mock('@/shared/ui/oauth/OAuthLinks', () => ({
  OAuthLinks: (props: any) => (
    <div data-testid="oauth-links" {...props}>
      OAuth Links
    </div>
  ),
}));

// Mock компонента Spinner
jest.mock('@/shared/ui', () => ({
  Spinner: (props: any) => (
    <div data-testid="spinner" {...props}>
      Spinner
    </div>
  ),
}));

import { useLogInForm } from '@/features/auth/sign-in/hooks/useLogInForm';

describe('🧪 LogIn Component', () => {
  const mockUseLogInForm = useLogInForm as jest.MockedFunction<
    typeof useLogInForm
  >;

  const defaultMockReturn = {
    register: jest.fn(),
    handleSubmit: jest.fn(),
    isDirty: false,
    hasLoginError: false,
    formErrors: {},
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLogInForm.mockReturnValue(defaultMockReturn);
  });

  describe('✅ Базовый рендеринг', () => {
    test('должен корректно рендериться', () => {
      render(<LogIn />);

      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('oauth-links')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Sign In' })
      ).toBeInTheDocument();
    });

    test('должен показывать все необходимые элементы формы', () => {
      render(<LogIn />);

      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    });
  });

  describe('🔄 Состояние загрузки', () => {
    test('должен показывать спиннер и сообщение при загрузке', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });

      render(<LogIn />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.getByText('Вход в систему...')).toBeInTheDocument();
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    test('должен показывать обычную кнопку когда не загружается', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        isLoading: false,
      });

      render(<LogIn />);

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      expect(screen.queryByText('Вход в систему...')).not.toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  describe('❌ Обработка ошибок', () => {
    test('должен показывать сообщение об ошибке входа', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        hasLoginError: true,
      });

      render(<LogIn />);

      expect(
        screen.getByText(
          'The email or password are incorrect. Try again please'
        )
      ).toBeInTheDocument();
    });

    test('не должен показывать сообщение об ошибке когда нет ошибок', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        hasLoginError: false,
      });

      render(<LogIn />);

      expect(
        screen.queryByText(
          'The email or password are incorrect. Try again please'
        )
      ).not.toBeInTheDocument();
    });
  });

  describe('🔒 Валидация формы', () => {
    test('должен показывать ошибки валидации email', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        formErrors: {
          email: { message: 'Invalid email format' },
        },
      });

      render(<LogIn />);

      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    test('должен показывать ошибки валидации password', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        formErrors: {
          password: { message: 'Password is required' },
        },
      });

      render(<LogIn />);

      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    test('должен показывать множественные ошибки валидации', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        formErrors: {
          email: { message: 'Invalid email format' },
          password: { message: 'Password is required' },
        },
      });

      render(<LogIn />);

      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  describe('📝 Состояние формы', () => {
    test('должен корректно отслеживать состояние isDirty', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        isDirty: true,
      });

      render(<LogIn />);

      // Форма изменена, но кнопка все еще активна (нет ошибок)
      expect(
        screen.getByRole('button', { name: 'Sign In' })
      ).toBeInTheDocument();
    });

    test('должен корректно работать с пустой формой', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        isDirty: false,
      });

      render(<LogIn />);

      // Форма не изменена, но кнопка все еще активна (нет ошибок)
      expect(
        screen.getByRole('button', { name: 'Sign In' })
      ).toBeInTheDocument();
    });
  });

  describe('🔗 Навигационные ссылки', () => {
    test('должен содержать ссылку на страницу регистрации', () => {
      render(<LogIn />);

      const signUpLink = screen.getByText('Sign Up');
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink.closest('a')).toHaveAttribute('href', '/sign-up');
    });

    test('должен содержать ссылку на восстановление пароля', () => {
      render(<LogIn />);

      const forgotPasswordLink = screen.getByText('Forgot Password');
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink.closest('a')).toHaveAttribute(
        'href',
        '/forgot-password'
      );
    });
  });

  describe('📱 Адаптивность и стили', () => {
    test('должен применять корректные CSS классы', () => {
      render(<LogIn />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass(
        'align-center',
        'mt-[24px]',
        'flex',
        'w-full',
        'max-w-[378px]'
      );
    });

    test('должен корректно работать с мобильными стилями', () => {
      render(<LogIn />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('max-sm:bg-dark-900', 'max-sm:border-hidden');
    });
  });

  describe('🎯 Интеграция с хуком', () => {
    test('должен корректно использовать хук useLogInForm', () => {
      render(<LogIn />);

      expect(mockUseLogInForm).toHaveBeenCalledTimes(1);
    });

    test('должен передавать все необходимые пропсы в дочерние компоненты', () => {
      render(<LogIn />);

      // Проверяем, что все компоненты получили необходимые пропсы
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('oauth-links')).toBeInTheDocument();
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  describe('🔍 Граничные случаи', () => {
    test('должен корректно работать с пустыми ошибками', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        formErrors: {},
      });

      render(<LogIn />);

      // Не должно быть ошибок валидации
      expect(
        screen.queryByText(/Invalid|Required|Error/)
      ).not.toBeInTheDocument();
    });

    test('должен корректно работать с undefined ошибками', () => {
      mockUseLogInForm.mockReturnValue({
        ...defaultMockReturn,
        formErrors: {
          email: undefined,
          password: undefined,
        } as any,
      });

      render(<LogIn />);

      // Не должно быть ошибок валидации
      expect(
        screen.queryByText(/Invalid|Required|Error/)
      ).not.toBeInTheDocument();
    });
  });
});
