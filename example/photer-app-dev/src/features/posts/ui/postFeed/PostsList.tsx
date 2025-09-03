'use client';

import { ReactElement } from 'react';
import { PostItem } from './PostItem';
import { Posts } from '@/features/posts/lib/post.types';
import { usePostsList } from '../../hooks/feed/usePostsList';

type Props = {
  profileId: string;
  ssrPosts?: Posts;
};

export const PostsList = ({ profileId, ssrPosts }: Props): ReactElement => {
  const { posts, triggerRef, isFetching, hasMore } = usePostsList({
    ssrPosts,
    profileId,
  });

  return (
    <div className="mt-12 flex flex-col">
      <div className="flex flex-wrap justify-center gap-[12px]">
        {posts?.items &&
        Array.isArray(posts.items) &&
        posts.items.length > 0 ? (
          posts.items.map((post) => <PostItem key={post.id} post={post} />)
        ) : (
          <p className="text-gray-400">No posts found</p>
        )}
      </div>
      <div
        ref={triggerRef}
        className="col-span-full py-4 text-center text-gray-500"
      >
        {isFetching ? 'Загрузка...' : hasMore ? 'Прокрути вниз 👇' : 'Конец 🎉'}
      </div>
    </div>
  );
};
