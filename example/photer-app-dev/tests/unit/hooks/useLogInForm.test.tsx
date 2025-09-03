import { renderHook, act, waitFor } from '@testing-library/react';
import { useLogInForm } from '@/features/auth/sign-in/hooks/useLogInForm';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Redux API
jest.mock('@/features/auth/api/authApi', () => ({
  useLoginMutation: jest.fn(),
}));

// Mock JWT decoder
jest.mock('@/shared/lib/decodeJwt', () => ({
  decodeJwt: jest.fn(),
}));

import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { decodeJwt } from '@/shared/lib/decodeJwt';

describe('🧪 useLogInForm Hook', () => {
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  const mockUseLoginMutation = useLoginMutation as jest.MockedFunction<
    typeof useLoginMutation
  >;
  const mockDecodeJwt = decodeJwt as jest.MockedFunction<typeof decodeJwt>;

  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  const mockLoginQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue(mockRouter);
    mockUseLoginMutation.mockReturnValue([
      mockLoginQuery,
      { isLoading: false, isError: false },
    ]);
    mockDecodeJwt.mockReturnValue({ userId: '123', sub: '123' });
  });

  describe('✅ Инициализация хука', () => {
    test('должен возвращать все необходимые методы и состояния', () => {
      const { result } = renderHook(() => useLogInForm());

      expect(result.current.register).toBeDefined();
      expect(result.current.handleSubmit).toBeDefined();
      expect(result.current.isDirty).toBeDefined();
      expect(result.current.hasLoginError).toBeDefined();
      expect(result.current.formErrors).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
    });

    test('должен инициализировать состояние загрузки как false', () => {
      const { result } = renderHook(() => useLogInForm());

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('🔄 Состояние загрузки и редиректа', () => {
    test('должен показывать состояние загрузки во время запроса', async () => {
      let resolveQuery: (value: any) => void;
      const queryPromise = new Promise((resolve) => {
        resolveQuery = resolve;
      });

      mockLoginQuery.mockReturnValue(queryPromise);

      const { result } = renderHook(() => useLogInForm());

      // Начинаем процесс входа
      act(() => {
        result.current.handleSubmit();
      });

      // Проверяем, что состояние загрузки активно
      expect(result.current.isLoading).toBe(true);

      // Завершаем запрос
      resolveQuery!({ accessToken: 'mock-token' });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true); // Все еще загрузка из-за редиректа
      });
    });

    test('должен сохранять состояние загрузки до редиректа', async () => {
      mockLoginQuery.mockResolvedValue({ accessToken: 'mock-token' });

      const { result } = renderHook(() => useLogInForm());

      // Начинаем процесс входа
      act(() => {
        result.current.handleSubmit();
      });

      // Ждем завершения запроса
      await waitFor(() => {
        expect(mockLoginQuery).toHaveBeenCalled();
      });

      // Проверяем, что состояние загрузки все еще активно (из-за редиректа)
      expect(result.current.isLoading).toBe(true);

      // Ждем завершения редиректа
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/profile/123');
      });
    });

    test('должен сбрасывать состояние загрузки при ошибке', async () => {
      mockLoginQuery.mockRejectedValue(new Error('Login failed'));

      const { result } = renderHook(() => useLogInForm());

      // Начинаем процесс входа
      act(() => {
        result.current.handleSubmit();
      });

      // Ждем завершения запроса с ошибкой
      await waitFor(() => {
        expect(mockLoginQuery).toHaveBeenCalled();
      });

      // Проверяем, что состояние загрузки сброшено
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('📝 Обработка формы', () => {
    test('должен корректно обрабатывать успешный вход', async () => {
      mockLoginQuery.mockResolvedValue({ accessToken: 'mock-token' });

      const { result } = renderHook(() => useLogInForm());

      // Начинаем процесс входа
      act(() => {
        result.current.handleSubmit();
      });

      // Ждем завершения запроса
      await waitFor(() => {
        expect(mockLoginQuery).toHaveBeenCalled();
      });

      // Проверяем, что JWT декодирован
      expect(mockDecodeJwt).toHaveBeenCalledWith('mock-token');

      // Проверяем, что произошел редирект
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/profile/123');
      });
    });

    test('должен корректно обрабатывать ошибку входа', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockLoginQuery.mockRejectedValue(new Error('Login failed'));

      const { result } = renderHook(() => useLogInForm());

      // Начинаем процесс входа
      act(() => {
        result.current.handleSubmit();
      });

      // Ждем завершения запроса с ошибкой
      await waitFor(() => {
        expect(mockLoginQuery).toHaveBeenCalled();
      });

      // Проверяем, что ошибка залогирована
      expect(consoleSpy).toHaveBeenCalledWith(
        'Login failed:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('🎯 Валидация и состояния формы', () => {
    test('должен корректно отслеживать состояние isDirty', () => {
      const { result } = renderHook(() => useLogInForm());

      // Изначально форма не изменена
      expect(result.current.isDirty).toBe(false);
    });

    test('должен корректно отслеживать ошибки формы', () => {
      const { result } = renderHook(() => useLogInForm());

      // Изначально нет ошибок
      expect(result.current.formErrors).toEqual({});
    });

    test('должен корректно отслеживать ошибки API', () => {
      mockUseLoginMutation.mockReturnValue([
        mockLoginQuery,
        { isLoading: false, isError: true },
      ]);

      const { result } = renderHook(() => useLogInForm());

      expect(result.current.hasLoginError).toBe(true);
    });
  });

  describe('🔒 Безопасность и обработка токенов', () => {
    test('должен корректно декодировать JWT токен', async () => {
      mockLoginQuery.mockResolvedValue({ accessToken: 'mock-jwt-token' });
      mockDecodeJwt.mockReturnValue({ userId: '456', sub: '456' });

      const { result } = renderHook(() => useLogInForm());

      act(() => {
        result.current.handleSubmit();
      });

      await waitFor(() => {
        expect(mockDecodeJwt).toHaveBeenCalledWith('mock-jwt-token');
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/profile/456');
      });
    });

    test('должен использовать sub как fallback для userId', async () => {
      mockLoginQuery.mockResolvedValue({ accessToken: 'mock-jwt-token' });
      mockDecodeJwt.mockReturnValue({ sub: '789' }); // Нет userId, только sub

      const { result } = renderHook(() => useLogInForm());

      act(() => {
        result.current.handleSubmit();
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/profile/789');
      });
    });

    test('должен корректно обрабатывать некорректный JWT', async () => {
      mockLoginQuery.mockResolvedValue({ accessToken: 'invalid-token' });
      mockDecodeJwt.mockImplementation(() => {
        throw new Error('Invalid JWT');
      });

      const { result } = renderHook(() => useLogInForm());

      act(() => {
        result.current.handleSubmit();
      });

      // Должен обработать ошибку декодирования
      await waitFor(() => {
        expect(mockDecodeJwt).toHaveBeenCalledWith('invalid-token');
      });
    });
  });

  describe('⏱️ Тайминги и задержки', () => {
    test('должен добавлять задержку перед редиректом', async () => {
      jest.useFakeTimers();

      mockLoginQuery.mockResolvedValue({ accessToken: 'mock-token' });

      const { result } = renderHook(() => useLogInForm());

      act(() => {
        result.current.handleSubmit();
      });

      // Ждем завершения запроса
      await waitFor(() => {
        expect(mockLoginQuery).toHaveBeenCalled();
      });

      // Проверяем, что редирект еще не произошел
      expect(mockRouter.push).not.toHaveBeenCalled();

      // Продвигаем время на 500ms
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Теперь редирект должен произойти
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/profile/123');
      });

      jest.useRealTimers();
    });

    test('должен корректно обрабатывать отмену редиректа при ошибке', async () => {
      jest.useFakeTimers();

      mockLoginQuery.mockRejectedValue(new Error('Login failed'));

      const { result } = renderHook(() => useLogInForm());

      act(() => {
        result.current.handleSubmit();
      });

      // Ждем завершения запроса с ошибкой
      await waitFor(() => {
        expect(mockLoginQuery).toHaveBeenCalled();
      });

      // Продвигаем время
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Проверяем, что редирект не произошел
      expect(mockRouter.push).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });
});
