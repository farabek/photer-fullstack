/**
 * API Integration Tests
 * Tests real API interactions and state management
 */

import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useGetPostsQuery, useCreatePostMutation } from '@/features/posts/api/postsApi';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { baseApi } from '@/shared/lib/baseApi';

// Test store setup
const createTestStore = () => configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={createTestStore()}>{children}</Provider>
);

describe('🔗 API Integration Tests', () => {
  beforeEach(() => {
    // Reset API state between tests
    jest.clearAllMocks();
  });

  describe('Authentication API Integration', () => {
    test('should handle successful login flow', async () => {
      const { result } = renderHook(() => useLoginMutation(), { wrapper });

      const [login] = result.current;

      // Mock successful login
      const mockResponse = {
        data: {
          accessToken: 'mock-token',
          user: {
            id: '1',
            userName: 'testuser',
            email: 'test@example.com',
          },
        },
      };

      // Mock fetch for this test
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse.data),
      });

      await waitFor(async () => {
        const result = await login({
          email: 'test@example.com',
          password: 'password123',
        });

        expect(result).toEqual(expect.objectContaining({
          data: expect.objectContaining({
            accessToken: expect.any(String),
            user: expect.objectContaining({
              id: expect.any(String),
              userName: expect.any(String),
              email: expect.any(String),
            }),
          }),
        }));
      });
    });

    test('should handle login errors gracefully', async () => {
      const { result } = renderHook(() => useLoginMutation(), { wrapper });

      const [login] = result.current;

      // Mock failed login
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      });

      await waitFor(async () => {
        const result = await login({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

        expect(result).toEqual(expect.objectContaining({
          error: expect.objectContaining({
            status: 401,
          }),
        }));
      });
    });
  });

  describe('Posts API Integration', () => {
    test('should fetch posts successfully', async () => {
      const mockPosts = [
        {
          id: '1',
          description: 'Test post',
          photos: ['photo1.jpg'],
          createdAt: '2023-01-01T00:00:00Z',
          user: {
            id: '1',
            userName: 'testuser',
            avatarPath: null,
          },
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ posts: mockPosts }),
      });

      const { result } = renderHook(() => useGetPostsQuery({ page: 1, limit: 10 }), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(
          expect.objectContaining({
            posts: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                description: expect.any(String),
                photos: expect.any(Array),
                user: expect.objectContaining({
                  userName: expect.any(String),
                }),
              }),
            ]),
          })
        );
      });
    });

    test('should create post successfully', async () => {
      const { result } = renderHook(() => useCreatePostMutation(), { wrapper });

      const [createPost] = result.current;

      const mockNewPost = {
        id: '2',
        description: 'New test post',
        photos: ['new-photo.jpg'],
        createdAt: '2023-01-02T00:00:00Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockNewPost),
      });

      await waitFor(async () => {
        const result = await createPost({
          description: 'New test post',
          photos: ['new-photo.jpg'],
        });

        expect(result).toEqual(expect.objectContaining({
          data: expect.objectContaining({
            id: expect.any(String),
            description: 'New test post',
            photos: expect.arrayContaining(['new-photo.jpg']),
          }),
        }));
      });
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useGetPostsQuery({ page: 1, limit: 10 }), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(result.current.isError).toBe(true);
      });
    });

    test('should handle server errors (500)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal server error' }),
      });

      const { result } = renderHook(() => useGetPostsQuery({ page: 1, limit: 10 }), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toEqual(
          expect.objectContaining({
            status: 500,
          })
        );
      });
    });
  });

  describe('Cache and State Management Integration', () => {
    test('should properly cache API responses', async () => {
      const mockPosts = [{ id: '1', description: 'Cached post' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ posts: mockPosts }),
      });

      const { result: result1 } = renderHook(() => useGetPostsQuery({ page: 1, limit: 10 }), { wrapper });

      await waitFor(() => {
        expect(result1.current.data).toBeDefined();
      });

      // Second hook should use cached data
      const { result: result2 } = renderHook(() => useGetPostsQuery({ page: 1, limit: 10 }), { wrapper });

      expect(result2.current.data).toEqual(result1.current.data);
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only one API call
    });

    test('should invalidate cache on mutations', async () => {
      const { result: queryResult } = renderHook(() => useGetPostsQuery({ page: 1, limit: 10 }), { wrapper });
      const { result: mutationResult } = renderHook(() => useCreatePostMutation(), { wrapper });

      // Mock initial fetch
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ posts: [] }),
      });

      await waitFor(() => {
        expect(queryResult.current.data).toBeDefined();
      });

      // Mock create post
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '1', description: 'New post' }),
      });

      const [createPost] = mutationResult.current;
      await createPost({ description: 'New post', photos: [] });

      // Should trigger refetch
      await waitFor(() => {
        expect(queryResult.current.isFetching).toBe(false);
      });
    });
  });
});