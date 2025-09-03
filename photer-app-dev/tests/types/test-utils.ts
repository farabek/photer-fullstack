// 🧪 Утилиты и типы для тестирования

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Типы для моков
export type MockFunction<T extends (...args: any) => any> =
  jest.MockedFunction<T>;

// Типы для тестовых данных
export interface TestUser {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}

export interface TestAuthState {
  user: TestUser | null;
  isLoading: boolean;
  error: string | null;
}

// Утилиты для создания тестовых данных
export const createTestUser = (
  overrides: Partial<TestUser> = {}
): TestUser => ({
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  isAuthenticated: true,
  ...overrides,
});

export const createTestAuthState = (
  overrides: Partial<TestAuthState> = {}
): TestAuthState => ({
  user: createTestUser(),
  isLoading: false,
  error: null,
  ...overrides,
});

// Кастомный рендерер для тестов с провайдерами
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Здесь можно добавить дополнительные опции для тестов
}

export const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  // В будущем здесь можно добавить провайдеры (Redux, Router, etc.)
  return render(ui, options);
};

// Утилиты для моков
export const createMockRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
});

export const createMockApiResponse = <T>(data: T, success = true) => ({
  data,
  success,
  error: success ? null : 'API Error',
});

// Утилиты для асинхронных тестов
export const waitForElementToBeRemoved = (element: Element | null) => {
  return new Promise<void>((resolve) => {
    if (!element) {
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

// Утилиты для тестирования событий
export const fireEvent = {
  click: (element: Element) => element.dispatchEvent(new MouseEvent('click')),
  change: (element: Element, value: string) => {
    if (element instanceof HTMLInputElement) {
      element.value = value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
  submit: (element: Element) =>
    element.dispatchEvent(new Event('submit', { bubbles: true })),
};

// Константы для тестов
export const TEST_IDS = {
  SIDEBAR: 'sidebar',
  SPINNER: 'spinner',
  CARD: 'card',
  OAUTH_LINKS: 'oauth-links',
  LOGIN_FORM: 'login-form',
  SIGN_IN_BUTTON: 'sign-in-button',
  EMAIL_INPUT: 'email-input',
  PASSWORD_INPUT: 'password-input',
} as const;

export const TEST_CLASSES = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
  DISABLED: 'disabled',
  HIDDEN: 'hidden',
  VISIBLE: 'visible',
} as const;

// Утилиты для проверки доступности
export const accessibilityChecks = {
  hasRole: (element: Element, role: string) =>
    element.getAttribute('role') === role,
  hasLabel: (element: Element, label: string) => {
    const ariaLabel = element.getAttribute('aria-label');
    const title = element.getAttribute('title');
    return ariaLabel === label || title === label;
  },
  isFocusable: (element: Element) => {
    const tabIndex = element.getAttribute('tabindex');
    return tabIndex !== '-1' && !element.hasAttribute('disabled');
  },
};

// Экспорт всех утилит
export * from '@testing-library/react';
export { customRender as render };
