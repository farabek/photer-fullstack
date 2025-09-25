'use client';

import { ReactElement, useEffect, useState } from 'react';
import { PostItem } from './PostItem';
import { Posts, PostType } from '@/features/posts/lib/post.types';
import { usePostsList } from '../../hooks/feed/usePostsList';
import { PostModal } from '@/widgets/posts';
import { useGetPostQuery } from '../../api/postsApi';

type Props = {
  profileId: string;
  ssrPosts?: Posts;
  postId?: string;
};

export const PostsList = ({
  profileId,
  ssrPosts,
  postId,
}: Props): ReactElement => {
  const { posts, triggerRef, isFetching, hasMore, error, retry } = usePostsList(
    {
      ssrPosts,
      profileId,
    }
  );

  // Добавляем детальное логирование PostsList
  console.log('=== POSTS LIST DEBUG ===', {
    profileId,
    ssrPosts: ssrPosts
      ? {
          itemsCount: ssrPosts.items?.length || 0,
          totalCount: ssrPosts.totalCount,
          hasItems: !!(ssrPosts.items && ssrPosts.items.length > 0),
          firstPost: ssrPosts.items?.[0],
        }
      : null,
    posts: posts
      ? {
          itemsCount: posts.items?.length || 0,
          totalCount: posts.totalCount,
          hasItems: !!(posts.items && posts.items.length > 0),
          firstPost: posts.items?.[0],
        }
      : null,
    isFetching,
    error,
    hasMore,
    timestamp: new Date().toISOString(),
  });
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  const { data: fetchedPost } = useGetPostQuery(postId || '', {
    skip: !postId || (posts?.items && posts.items.some((p) => p.id === postId)),
  });

  useEffect(() => {
    if (postId && posts?.items && posts.items.length > 0) {
      const post = posts.items.find((p) => p.id === postId);
      if (post) {
        setSelectedPost(post);
      }
    } else if (postId && fetchedPost) {
      setSelectedPost(fetchedPost);
    }
  }, [postId, posts, fetchedPost]);

  const handleCloseModal = (): void => {
    setSelectedPost(null);
  };

  return (
    <div className="mt-12 flex flex-col">
      <div className="flex flex-wrap justify-center gap-[12px]">
        {posts?.items &&
        Array.isArray(posts.items) &&
        posts.items.length > 0 ? (
          posts.items.map((post) => {
            // Debug logging for PostsList -> PostItem
            console.log('=== POSTS LIST -> POST ITEM DEBUG ===', {
              postId: post.id,
              description: post.description,
              timestamp: new Date().toISOString(),
            });
            return (
              <PostItem key={post.id} post={post} allUserPosts={posts.items} />
            );
          })
        ) : (
          <div className="py-8 text-center">
            <p className="text-lg font-medium text-gray-400">No posts found</p>
          </div>
        )}
      </div>

      {error && (
        <div className="col-span-full py-8 text-center">
          <p className="mb-4 text-red-400">{error}</p>
          <button
            onClick={retry}
            className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            disabled={isFetching}
          >
            {isFetching ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      )}

      <div
        ref={triggerRef}
        className="col-span-full py-4 text-center text-gray-500"
      >
        {isFetching ? 'Загрузка...' : hasMore ? 'Прокрути вниз 👇' : 'Конец 🎉'}
      </div>
      {selectedPost && (
        <PostModal
          post={selectedPost}
          allUserPosts={posts?.items}
          onCloseAction={handleCloseModal}
        />
      )}
    </div>
  );
};
