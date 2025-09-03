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

  return (
    <>
      <div
        className={'relative h-57 w-[250px]'}
        onClick={() => setIsOpenPost(true)}
      >
        {post.photos.length > 0 && (
          <Image
            src={post.photos[0]}
            alt={'post image'}
            unoptimized
            fill
            className="object-cover"
          />
        )}
      </div>
      {isOpenPost && (
        <PostModal post={post} onCloseAction={() => setIsOpenPost(false)} />
      )}
    </>
  );
};
