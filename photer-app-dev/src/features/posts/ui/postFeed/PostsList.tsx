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
  const { posts, triggerRef, isFetching, hasMore } = usePostsList({
    ssrPosts,
    profileId,
  });
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  const { data: fetchedPost } = useGetPostQuery(Number(postId), {
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

  console.log('PostsList render:', {
    postsCount: posts?.items?.length || 0,
    isFetching,
    hasMore,
  });

  return (
    <div className="mt-12 flex flex-col">
      <div className="flex flex-wrap justify-center gap-[12px]">
        {posts?.items &&
        Array.isArray(posts.items) &&
        posts.items.length > 0 ? (
          posts.items.map((post, index) => {
            console.log(`Rendering PostItem ${index}:`, {
              postId: post.id,
              hasPhotos: post.photos?.length > 0,
            });
            return <PostItem key={post.id} post={post} />;
          })
        ) : (
          <div className="py-8 text-center">
            <p className="text-lg font-medium text-gray-400">No posts found</p>
            <p className="mt-2 text-sm text-gray-300">
              Debug info:
              {posts?.items &&
                !Array.isArray(posts.items) &&
                ' (posts.items is not array)'}
              {posts?.items &&
                Array.isArray(posts.items) &&
                posts.items.length === 0 &&
                ' (empty array)'}
              {!posts?.items && ' (no posts object)'}
            </p>
            <p className="text-sm text-gray-300">
              Check console for detailed logs
            </p>
          </div>
        )}
      </div>
      <div
        ref={triggerRef}
        className="col-span-full py-4 text-center text-gray-500"
      >
        {isFetching ? 'Загрузка...' : hasMore ? 'Прокрути вниз 👇' : 'Конец 🎉'}
      </div>
      {selectedPost && (
        <PostModal post={selectedPost} onCloseAction={handleCloseModal} />
      )}
    </div>
  );
};
