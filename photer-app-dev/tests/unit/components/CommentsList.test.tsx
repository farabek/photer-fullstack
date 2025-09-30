/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CommentsList } from '@/features/posts/ui/postView/CommentsList';
import { useGetPostCommentsQuery } from '@/features/posts/api/postsApi';

// Mock the API hook
jest.mock('@/features/posts/api/postsApi', () => ({
  useGetPostCommentsQuery: jest.fn(),
}));

// Mock ViewComment component
jest.mock('@/features/posts/ui/postView/ViewComment', () => ({
  ViewComment: ({ comment, userName }: any) => (
    <div data-testid="view-comment">
      <span data-testid="comment-text">{comment}</span>
      <span data-testid="comment-user">{userName}</span>
    </div>
  ),
}));

describe('🧪 CommentsList Component', () => {
  const mockComments = [
    {
      id: 'comment1',
      text: 'First comment',
      createdAt: '2025-01-01T00:00:00Z',
      owner: {
        userId: 'user1',
        userName: 'testuser1',
        avatarUrl: 'avatar1.jpg',
      },
    },
    {
      id: 'comment2',
      text: 'Second comment',
      createdAt: '2025-01-02T00:00:00Z',
      owner: {
        userId: 'user2',
        userName: 'testuser2',
        avatarUrl: 'avatar2.jpg',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading message when comments are loading', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(screen.getByText('Загрузка комментариев...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when comments fail to load', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: { message: 'Failed to load' },
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(screen.getByText('Ошибка загрузки комментариев')).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load comments:',
        { message: 'Failed to load' }
      );
    });
  });

  describe('Empty State', () => {
    it('should display "no comments" message when comments array is empty', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(screen.getByText('Нет комментариев')).toBeInTheDocument();
    });

    it('should display "no comments" message when comments data is null', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(screen.getByText('Нет комментариев')).toBeInTheDocument();
    });
  });

  describe('Successful Comments Display', () => {
    it('should render comments when data is loaded', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: mockComments,
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(screen.getAllByTestId('view-comment')).toHaveLength(2);
      expect(screen.getByText('First comment')).toBeInTheDocument();
      expect(screen.getByText('Second comment')).toBeInTheDocument();
      expect(screen.getByText('testuser1')).toBeInTheDocument();
      expect(screen.getByText('testuser2')).toBeInTheDocument();
    });

    it('should render single comment correctly', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: [mockComments[0]],
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(screen.getAllByTestId('view-comment')).toHaveLength(1);
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });
  });

  describe('API Query Configuration', () => {
    it('should load comments for regular post ID', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: mockComments,
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post123" isAuthorized={true} />);

      expect(useGetPostCommentsQuery).toHaveBeenCalledWith('post123', {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
      });
    });

    it('should load comments for all post types including virtual posts', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: mockComments,
        isLoading: false,
        error: null,
      });

      // Test with virtual post ID from main page
      render(<CommentsList postId="virtual-user123" isAuthorized={true} />);

      expect(useGetPostCommentsQuery).toHaveBeenCalledWith('virtual-user123', {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
      });
    });

    it('should use realPostId when provided for virtual posts', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: mockComments,
        isLoading: false,
        error: null,
      });

      // In real usage, realPostId would be passed from ViewPost
      // This tests that the component loads comments with the provided postId
      render(<CommentsList postId="cmfwqntwf0000v3fcpfhx9epq" isAuthorized={true} />);

      expect(useGetPostCommentsQuery).toHaveBeenCalledWith(
        'cmfwqntwf0000v3fcpfhx9epq',
        expect.objectContaining({
          refetchOnMountOrArgChange: true,
        })
      );
    });
  });

  describe('Authorization Context', () => {
    it('should render comments for authorized users', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: mockComments,
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(screen.getAllByTestId('view-comment')).toHaveLength(2);
    });

    it('should render comments for unauthorized users', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: mockComments,
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={false} />);

      expect(screen.getAllByTestId('view-comment')).toHaveLength(2);
    });
  });

  describe('Debug Logging', () => {
    it('should log debug information when rendering', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: mockComments,
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(consoleSpy).toHaveBeenCalledWith(
        '=== COMMENTS LIST DEBUG ===',
        expect.objectContaining({
          postId: 'post1',
          commentsCount: 2,
          isLoading: false,
          hasError: false,
        })
      );
    });

    it('should log when there are no comments', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(consoleSpy).toHaveBeenCalledWith(
        '=== COMMENTS LIST DEBUG ===',
        expect.objectContaining({
          postId: 'post1',
          commentsCount: 0,
          isLoading: false,
          hasError: false,
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle comments with missing owner data gracefully', () => {
      const commentsWithMissingData = [
        {
          id: 'comment1',
          text: 'Comment text',
          createdAt: '2025-01-01T00:00:00Z',
          owner: {
            userId: 'user1',
            userName: 'testuser',
            avatarUrl: null, // Missing avatar
          },
        },
      ];

      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: commentsWithMissingData,
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(screen.getByText('Comment text')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('should handle very long comment lists', () => {
      const manyComments = Array.from({ length: 100 }, (_, i) => ({
        id: `comment${i}`,
        text: `Comment ${i}`,
        createdAt: '2025-01-01T00:00:00Z',
        owner: {
          userId: `user${i}`,
          userName: `user${i}`,
          avatarUrl: null,
        },
      }));

      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: manyComments,
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(screen.getAllByTestId('view-comment')).toHaveLength(100);
    });
  });

  describe('Refetch Behavior', () => {
    it('should configure refetch on mount and focus', () => {
      (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
        data: mockComments,
        isLoading: false,
        error: null,
      });

      render(<CommentsList postId="post1" isAuthorized={true} />);

      expect(useGetPostCommentsQuery).toHaveBeenCalledWith(
        'post1',
        expect.objectContaining({
          refetchOnMountOrArgChange: true,
          refetchOnFocus: true,
          refetchOnReconnect: true,
        })
      );
    });
  });
});