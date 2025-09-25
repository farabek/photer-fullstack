/**
 * Comprehensive Test Setup for Photer Frontend
 * Provides utilities, mocks, and configuration for all test types
 */

import { configure } from '@testing-library/react';
import '@testing-library/jest-dom';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
  computedStyleSupportsPseudoElements: true,
});

// Global test environment setup
export const setupTestEnvironment = () => {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock fetch
  global.fetch = jest.fn();

  // Mock next/navigation
  jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
    redirect: jest.fn(),
  }));

  // Mock next/image
  jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      return <img {...props} />;
    },
  }));
};

// Quality gates for tests
export const QUALITY_GATES = {
  COVERAGE: {
    STATEMENTS: 85,
    BRANCHES: 80,
    FUNCTIONS: 85,
    LINES: 85,
  },
  PERFORMANCE: {
    MAX_RENDER_TIME: 100, // ms
    MAX_API_RESPONSE_TIME: 500, // ms
  },
  ACCESSIBILITY: {
    MIN_LIGHTHOUSE_SCORE: 90,
  },
} as const;

// Test categories
export const TEST_CATEGORIES = {
  UNIT: 'unit',
  INTEGRATION: 'integration',
  E2E: 'e2e',
  ACCESSIBILITY: 'a11y',
  PERFORMANCE: 'performance',
  VISUAL: 'visual',
} as const;

// Setup function to run before all tests
setupTestEnvironment();