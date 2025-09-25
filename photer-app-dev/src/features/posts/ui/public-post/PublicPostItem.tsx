'use client';

import Link from 'next/link';
import { Carousel } from '@/shared/ui';
import Image from 'next/image';
import { AvatarWithName } from '@/features/posts/ui/postView/AvatarWithName';
import { useTimeAgo } from '@/features/posts/hooks/view/useTimePost';
import { Description } from '@/entities/post/ui/Description';
import { PostType } from '@/features/posts/lib/post.types';
import { ReactElement, useState, useEffect } from 'react';
import { PostModal } from '@/widgets/posts/postView/PostModal';

type Props = {
  post: PostType;
};

export const PublicPostItem = ({ post }: Props): ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeAgo, setTimeAgo] = useState<string>('');

  // Initialize time on client-side only to avoid hydration mismatch
  useEffect(() => {
    setTimeAgo(useTimeAgo(post.createdAt));
  }, [post.createdAt]);

  console.log('=== PUBLIC POST ITEM RENDER ===', {
    postId: post.id,
    userId: post.owner?.userId,
    userName: post.owner?.userName,
    photosCount: post.photos?.length || 0,
    hasMultiplePhotos: (post.photos?.length || 0) > 1,
    timestamp: new Date().toISOString(),
  });

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex h-98 w-58 flex-col">
        <div
          onClick={handleImageClick}
          className="h-60 shrink-0 cursor-pointer"
        >
          <Carousel className="relative h-full" showIndicators={true}>
            {post.photos && post.photos.length > 0
              ? post.photos.map((photo, index) => (
                  <div key={index} className="relative h-full w-full">
                    <img
                      src={photo}
                      alt={`Post image ${index + 1} of ${post.photos.length}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                    {/* Индикатор количества фото */}
                    {index === 0 && post.photos.length > 0 && (
                      <div className="bg-dark-300/90 text-light-100 border-light-100/20 absolute right-2 bottom-2 rounded-full border px-3 py-1 text-sm font-bold shadow-lg">
                        📷 {post.photos.length}
                      </div>
                    )}
                  </div>
                ))
              : null}
          </Carousel>
        </div>

        <Link href={`/profile/${post.owner.userId}`}>
          <AvatarWithName
            avatarUrl={post.owner.avatarUrl}
            userName={post.owner.userName}
            className="text-blue-500"
            avatarClassName="border-2 border-blue-500"
          />
        </Link>

        <span className="small-text text-light-900">{timeAgo || '...'}</span>

        <Description description={post.description} />
      </div>

      {/* Modal for viewing all user photos */}
      {isModalOpen && (
        <PostModal post={post} onCloseAction={() => setIsModalOpen(false)} />
      )}
    </>
  );
};
