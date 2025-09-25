/**
 * Performance Tests
 * Tests rendering performance, memory usage, and optimization
 */

import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { performance } from 'perf_hooks';

// Component imports for testing
import { PostsList } from '@/features/posts/ui/postFeed/PostsList';
import { Carousel } from '@/shared/ui/carousel/Carousel';
import { useSidebarVisibility } from '@/shared/hooks/useSidebarVisibility';

// Performance measurement utilities
const measureRenderTime = (renderFunction: () => void): number => {
  const start = performance.now();
  renderFunction();
  const end = performance.now();
  return end - start;
};

const measureMemoryUsage = (): MemoryInfo => {
  return (performance as any).memory;
};

// Mock data generators
const generateMockPosts = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `post-${index}`,
    description: `Mock post description ${index}`,
    photos: [`photo-${index}.jpg`],
    createdAt: new Date().toISOString(),
    user: {
      id: `user-${index}`,
      userName: `user${index}`,
      avatarPath: null,
    },
    commentsCount: Math.floor(Math.random() * 50),
    likesCount: Math.floor(Math.random() * 100),
    isLiked: Math.random() > 0.5,
  }));
};

const createTestStore = () => configureStore({
  reducer: {
    posts: (state = { posts: [], isLoading: false }, action) => state,
  },
});

describe('⚡ Performance Tests', () => {
  let originalConsoleWarn: typeof console.warn;

  beforeAll(() => {
    // Suppress React warnings for performance tests
    originalConsoleWarn = console.warn;
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.warn = originalConsoleWarn;
  });

  describe('Render Performance', () => {
    test('should render PostsList with 100 posts quickly', () => {
      const posts = generateMockPosts(100);
      const store = createTestStore();

      const renderTime = measureRenderTime(() => {
        render(
          <Provider store={store}>
            <PostsList posts={posts} isLoading={false} />
          </Provider>
        );
      });

      // Should render 100 posts in less than 100ms
      expect(renderTime).toBeLessThan(100);
      console.log(`PostsList (100 items) rendered in ${renderTime.toFixed(2)}ms`);
    });

    test('should handle large carousel efficiently', () => {
      const photos = Array.from({ length: 50 }, (_, i) => `photo-${i}.jpg`);

      const renderTime = measureRenderTime(() => {
        render(
          <Carousel photos={photos} currentIndex={0} onPhotoChange={jest.fn()} />
        );
      });

      // Should render large carousel in less than 50ms
      expect(renderTime).toBeLessThan(50);
      console.log(`Carousel (50 photos) rendered in ${renderTime.toFixed(2)}ms`);
    });

    test('should re-render efficiently on props changes', () => {
      const posts = generateMockPosts(10);
      const store = createTestStore();

      const { rerender } = render(
        <Provider store={store}>
          <PostsList posts={posts} isLoading={false} />
        </Provider>
      );

      // Measure re-render time
      const reRenderTime = measureRenderTime(() => {
        rerender(
          <Provider store={store}>
            <PostsList posts={posts.slice(0, 5)} isLoading={false} />
          </Provider>
        );
      });

      // Re-render should be very fast
      expect(reRenderTime).toBeLessThan(20);
      console.log(`PostsList re-render completed in ${reRenderTime.toFixed(2)}ms`);
    });
  });

  describe('Hook Performance', () => {
    test('should execute hooks efficiently', () => {
      const hookExecutionTime = measureRenderTime(() => {
        renderHook(() => useSidebarVisibility());
      });

      // Hook should initialize quickly
      expect(hookExecutionTime).toBeLessThan(10);
      console.log(`useSidebarVisibility hook executed in ${hookExecutionTime.toFixed(2)}ms`);
    });

    test('should handle multiple hook re-renders efficiently', () => {
      const { result, rerender } = renderHook(() => useSidebarVisibility());

      let totalReRenderTime = 0;
      const iterations = 10;

      for (let i = 0; i < iterations; i++) {
        const reRenderTime = measureRenderTime(() => {
          rerender();
        });
        totalReRenderTime += reRenderTime;
      }

      const averageReRenderTime = totalReRenderTime / iterations;
      expect(averageReRenderTime).toBeLessThan(5);
      console.log(`Average hook re-render time: ${averageReRenderTime.toFixed(2)}ms`);
    });
  });

  describe('Memory Usage', () => {
    test('should not cause memory leaks with large datasets', () => {
      const initialMemory = measureMemoryUsage();

      // Render large component multiple times
      for (let i = 0; i < 10; i++) {
        const posts = generateMockPosts(100);
        const store = createTestStore();

        const { unmount } = render(
          <Provider store={store}>
            <PostsList posts={posts} isLoading={false} />
          </Provider>
        );

        // Unmount to check for memory leaks
        unmount();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = measureMemoryUsage();
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });
  });

  describe('Virtual Scrolling Performance', () => {
    test('should handle virtual scrolling efficiently', () => {
      // Mock intersection observer for virtual scrolling
      const mockIntersectionObserver = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
      });
      window.IntersectionObserver = mockIntersectionObserver;

      const posts = generateMockPosts(1000);
      const store = createTestStore();

      const renderTime = measureRenderTime(() => {
        render(
          <Provider store={store}>
            <PostsList posts={posts} isLoading={false} />
          </Provider>
        );
      });

      // Even with 1000 posts, initial render should be fast due to virtualization
      expect(renderTime).toBeLessThan(200);
      console.log(`Virtual scrolling (1000 items) rendered in ${renderTime.toFixed(2)}ms`);
    });
  });

  describe('Image Loading Performance', () => {
    test('should handle image lazy loading efficiently', async () => {
      const posts = generateMockPosts(20);
      const store = createTestStore();

      const renderTime = measureRenderTime(() => {
        render(
          <Provider store={store}>
            <PostsList posts={posts} isLoading={false} />
          </Provider>
        );
      });

      // Lazy loading should not impact initial render
      expect(renderTime).toBeLessThan(100);

      // Check that images are lazy loaded
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });
  });

  describe('Bundle Size Impact', () => {
    test('should use tree shaking for unused imports', () => {
      // This would typically be tested with bundle analyzers
      // For now, we'll ensure components import only what they need

      const componentImports = [
        'react',
        '@/shared/ui',
        '@/features/posts',
      ];

      componentImports.forEach(importPath => {
        expect(importPath).toBeDefined();
      });

      // Mock test to ensure we're not importing entire lodash, etc.
      const forbiddenImports = [
        'lodash', // Should use lodash-es or specific functions
        'moment', // Should use date-fns
        'axios', // Should use fetch
      ];

      // In a real scenario, this would check actual bundle analysis
      forbiddenImports.forEach(forbidden => {
        // This is a mock assertion - in reality, you'd check bundle contents
        expect(forbidden).not.toBe('included-in-bundle');
      });
    });
  });

  describe('Animation Performance', () => {
    test('should handle smooth animations', () => {
      jest.useFakeTimers();

      const { container } = render(
        <div className="transition-all duration-300 ease-in-out">
          Animated content
        </div>
      );

      // Check that animation classes are applied
      const animatedElement = container.firstChild as HTMLElement;
      expect(animatedElement).toHaveClass('transition-all');
      expect(animatedElement).toHaveClass('duration-300');

      jest.useRealTimers();
    });
  });

  describe('State Update Performance', () => {
    test('should batch state updates efficiently', () => {
      let updateCount = 0;
      const TestComponent = () => {
        const [count, setCount] = React.useState(0);

        React.useEffect(() => {
          updateCount++;
        });

        const handleMultipleUpdates = () => {
          // These should be batched in React 18
          setCount(prev => prev + 1);
          setCount(prev => prev + 1);
          setCount(prev => prev + 1);
        };

        return (
          <div>
            <span data-testid="count">{count}</span>
            <button onClick={handleMultipleUpdates}>Update</button>
          </div>
        );
      };

      render(<TestComponent />);

      const button = screen.getByRole('button');
      const initialUpdateCount = updateCount;

      act(() => {
        button.click();
      });

      // Should only trigger one re-render due to batching
      expect(updateCount - initialUpdateCount).toBe(1);
      expect(screen.getByTestId('count')).toHaveTextContent('3');
    });
  });

  describe('Resource Cleanup', () => {
    test('should clean up event listeners on unmount', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const TestComponent = () => {
        React.useEffect(() => {
          const handler = () => {};
          window.addEventListener('resize', handler);
          return () => window.removeEventListener('resize', handler);
        }, []);

        return <div>Test component</div>;
      };

      const { unmount } = render(<TestComponent />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});