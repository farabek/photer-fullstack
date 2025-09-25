/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PostItem } from '@/features/posts/ui/postFeed/PostItem';
import { PostType } from '@/features/posts/lib/post.types';

// Mock PostModal
jest.mock('@/widgets/posts', () => ({
  PostModal: ({ post, onCloseAction }: any) => (
    <div data-testid="post-modal" onClick={onCloseAction}>
      <div data-testid="modal-post-id">{post.id}</div>
      <div data-testid="modal-photos-count">{post.photos.length}</div>
      <div data-testid="modal-description">{post.description}</div>
    </div>
  ),
}));

// Mock Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} data-testid="next-image" />
  ),
}));

describe('PostItem Component', () => {
  const mockOwner = {
    id: 'user1',
    userName: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    avatarUrl: 'avatar.jpg',
  };

  const mockPost: PostType = {
    id: 'post1',
    description: 'Test post description',
    photos: ['photo1.jpg', 'photo2.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: mockOwner,
  };

  const mockAllUserPosts: PostType[] = [
    mockPost,
    {
      id: 'post2',
      description: 'Second post',
      photos: ['photo3.jpg', 'photo4.jpg'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: mockOwner,
    },
    {
      id: 'post3',
      description: 'Third post',
      photos: ['photo5.jpg'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: mockOwner,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders post item with first photo', () => {
      render(<PostItem post={mockPost} />);

      expect(screen.getByTestId('post-item')).toBeInTheDocument();
      expect(screen.getByAltText('post image')).toHaveAttribute(
        'src',
        'photo1.jpg'
      );
    });

    it('renders "No Image" when post has no photos', () => {
      const postWithoutPhotos = { ...mockPost, photos: [] };
      render(<PostItem post={postWithoutPhotos} />);

      expect(screen.getByText('No Image')).toBeInTheDocument();
      expect(screen.queryByAltText('post image')).not.toBeInTheDocument();
    });

    it('handles post click to open modal', () => {
      render(<PostItem post={mockPost} />);

      const postItem = screen.getByTestId('post-item');
      fireEvent.click(postItem);

      expect(screen.getByTestId('post-modal')).toBeInTheDocument();
    });
  });

  describe('Virtual Post Creation', () => {
    it('creates virtual post with all user photos when allUserPosts provided', () => {
      render(
        <PostItem post={mockPost} allUserPosts={mockAllUserPosts} />
      );

      // Click to open modal
      fireEvent.click(screen.getByTestId('post-item'));

      // Should show modal with virtual post
      expect(screen.getByTestId('post-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-post-id')).toHaveTextContent(
        'virtual-profile-user1'
      );
      expect(screen.getByTestId('modal-photos-count')).toHaveTextContent('5'); // All photos from all posts
      expect(screen.getByTestId('modal-description')).toHaveTextContent(
        'All photos from testuser'
      );
    });

    it('uses original post when no allUserPosts provided', () => {
      render(<PostItem post={mockPost} />);

      fireEvent.click(screen.getByTestId('post-item'));

      expect(screen.getByTestId('modal-post-id')).toHaveTextContent('post1');
      expect(screen.getByTestId('modal-photos-count')).toHaveTextContent('2'); // Original post photos
      expect(screen.getByTestId('modal-description')).toHaveTextContent(
        'Test post description'
      );
    });

    it('uses original post when allUserPosts is empty', () => {
      render(<PostItem post={mockPost} allUserPosts={[]} />);

      fireEvent.click(screen.getByTestId('post-item'));

      expect(screen.getByTestId('modal-post-id')).toHaveTextContent('post1');
      expect(screen.getByTestId('modal-photos-count')).toHaveTextContent('2');
    });

    it('aggregates all photos from multiple posts correctly', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      render(
        <PostItem post={mockPost} allUserPosts={mockAllUserPosts} />
      );

      fireEvent.click(screen.getByTestId('post-item'));

      // Check if virtual post creation was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        '=== VIRTUAL POST CREATED FOR PROFILE ===',
        expect.objectContaining({
          originalPostId: 'post1',
          virtualPostId: 'virtual-profile-user1',
          userId: 'user1',
          userName: 'testuser',
          originalPhotosCount: 2,
          totalPhotosFromAllPosts: 5, // 2 + 2 + 1 = 5 photos total
          allUserPostsCount: 3,
          allPhotos: [
            'photo1.jpg',
            'photo2.jpg',
            'photo3.jpg',
            'photo4.jpg',
            'photo5.jpg',
          ],
        })
      );
    });
  });

  describe('Modal Management', () => {
    it('closes modal when onCloseAction is called', async () => {
      render(<PostItem post={mockPost} />);

      // Open modal
      fireEvent.click(screen.getByTestId('post-item'));
      expect(screen.getByTestId('post-modal')).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByTestId('post-modal'));

      await waitFor(() => {
        expect(screen.queryByTestId('post-modal')).not.toBeInTheDocument();
      });
    });

    it('does not render modal initially', () => {
      render(<PostItem post={mockPost} />);

      expect(screen.queryByTestId('post-modal')).not.toBeInTheDocument();
    });
  });

  describe('Debug Logging', () => {
    it('logs post item debug information', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      render(
        <PostItem post={mockPost} allUserPosts={mockAllUserPosts} />
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        '=== POST ITEM DEBUG ===',
        expect.objectContaining({
          postId: 'post1',
          hasPhotos: true,
          photosCount: 2,
          firstPhoto: 'photo1.jpg',
          photosArray: ['photo1.jpg', 'photo2.jpg'],
          hasAllUserPosts: true,
          allUserPostsCount: 3,
          willCreateVirtualPost: true, // More than 1 post
        })
      );
    });

    it('logs virtual post creation when modal opens', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      render(
        <PostItem post={mockPost} allUserPosts={mockAllUserPosts} />
      );

      fireEvent.click(screen.getByTestId('post-item'));

      expect(consoleSpy).toHaveBeenCalledWith(
        '=== POST ITEM -> POST MODAL DEBUG ===',
        expect.objectContaining({
          postId: 'post1',
          description: 'Test post description',
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles posts with no photos in allUserPosts', () => {
      const postsWithEmptyPhotos = [
        { ...mockPost, photos: [] },
        { ...mockPost, id: 'post2', photos: ['photo1.jpg'] },
      ];

      render(
        <PostItem
          post={mockPost}
          allUserPosts={postsWithEmptyPhotos}
        />
      );

      fireEvent.click(screen.getByTestId('post-item'));

      // Should only include photos from posts that have them
      expect(screen.getByTestId('modal-photos-count')).toHaveTextContent('1');
    });

    it('handles null/undefined photos arrays', () => {
      const postWithNullPhotos = { ...mockPost, photos: [] };
      const allPostsWithSomeNull = [
        postWithNullPhotos,
        mockAllUserPosts[0],
      ];

      render(
        <PostItem
          post={postWithNullPhotos}
          allUserPosts={allPostsWithSomeNull}
        />
      );

      expect(screen.getByText('No Image')).toBeInTheDocument();
    });

    it('preserves original post properties in virtual post', () => {
      render(
        <PostItem post={mockPost} allUserPosts={mockAllUserPosts} />
      );

      fireEvent.click(screen.getByTestId('post-item'));

      // Virtual post should preserve owner and other properties
      const consoleSpy = jest.spyOn(console, 'log');
      expect(consoleSpy).toHaveBeenCalledWith(
        '=== VIRTUAL POST CREATED FOR PROFILE ===',
        expect.objectContaining({
          userName: 'testuser',
          userId: 'user1',
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(<PostItem post={mockPost} />);

      const postItem = screen.getByTestId('post-item');
      expect(postItem).toHaveAttribute('data-testid', 'post-item');
    });

    it('provides meaningful alt text for images', () => {
      render(<PostItem post={mockPost} />);

      const image = screen.getByAltText('post image');
      expect(image).toBeInTheDocument();
    });
  });
});