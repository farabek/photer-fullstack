'use client';
import { ReactElement, useState } from 'react';
import Image from 'next/image';
import { PostType } from '@/features/posts/lib/post.types';
import { PostModal } from '@/widgets/posts';

type Props = {
  post: PostType;
};

export const PostItem = ({ post }: Props): ReactElement => {
  const [isOpenPost, setIsOpenPost] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType>(post);

  const handlePostUpdated = (updatedPost: PostType): void => {
    console.log('🔄 [POST ITEM] Post updated, updating local state', {
      postId: updatedPost.id,
      oldDescription: currentPost.description,
      newDescription: updatedPost.description,
      timestamp: new Date().toISOString(),
    });
    setCurrentPost(updatedPost);
  };

  return (
    <>
      <div
        className={'relative h-57 w-[250px]'}
        onClick={() => setIsOpenPost(true)}
      >
        {currentPost.photos.length > 0 ? (
          <div className="relative h-full w-full">
            <img
              src={currentPost.photos[0]}
              alt={'post image'}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
            No Image
          </div>
        )}
      </div>
      {isOpenPost && (
        <PostModal
          post={currentPost}
          onCloseAction={() => setIsOpenPost(false)}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </>
  );
};
