'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { PostInfo } from './PostInfo';
import { AddComment } from './AddComment';
import { AvatarWithName } from './AvatarWithName';
import { PostDescription } from './PostDescription';
import { CommentsList } from './CommentsList';
import { Carousel } from '@/shared/ui/carousel/Carousel';
import { PostType } from '../../lib/post.types';

type Props = {
  post: PostType;
  children?: ReactNode;
  isAuthorized: boolean;
  isOwner: boolean;
  realPostId?: string; // Real post ID for database operations (comments, etc.)
};

export const ViewPost = ({
  post,
  children,
  isAuthorized,
  isOwner,
  realPostId,
}: Props): ReactNode => {
  // Debug logging for ViewPost
  console.log('=== VIEW POST DEBUG ===', {
    postId: post.id,
    description: post.description,
    isAuthorized,
    isOwner,
    photosCount: post.photos?.length || 0,
    hasPhotos: !!(post.photos && post.photos.length > 0),
    photosArray: post.photos,
    timestamp: new Date().toISOString(),
  });

  // Enhanced carousel debug logging
  console.log('=== VIEW POST CAROUSEL DEBUG ===', {
    postId: post.id,
    isAuthorized,
    isOwner,
    photosCount: post.photos?.length || 0,
    willShowCarousel: !!(post.photos && post.photos.length > 0),
    carouselShowIndicators: true, // Now enabled for ViewPost
    needsShowIndicators: post.photos?.length > 1,
    timestamp: new Date().toISOString(),
  });

  return (
    <div className="bg-dark-300 border-dark-100 flex h-full w-full overflow-hidden">
      {/* Левая часть — фото со скроллом при необходимости */}
      <div className="flex-1 overflow-y-auto">
        <Carousel className="relative h-full w-full" showIndicators={true}>
          {post.photos.map((photo, index) => (
            <div key={index} className="relative h-full w-full">
              <img
                src={photo}
                alt="Post image"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ width: '100%', height: '100%' }}
                onError={(e) => {
                  console.error('Failed to load image:', photo);
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML =
                      '<div class="flex items-center justify-center h-full bg-gray-200 text-gray-500 text-sm">Failed to load image</div>';
                  }
                }}
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Правая часть — описание, комментарии, действия */}
      <div className="flex flex-1 flex-col justify-between overflow-y-auto">
        {/* Верх: шапка, описание, комментарии */}
        <div>
          <div className="border-dark-100 flex justify-between border-b px-6">
            <AvatarWithName
              avatarUrl={post.owner.avatarUrl}
              userName={post.owner.userName}
            />
            {children}
          </div>

          <div className="border-dark-100 flex flex-col gap-4 border-b px-6 pt-4 pb-2">
            <PostDescription post={post} />
            {/* Show comments for real posts and virtual posts from profile */}
            {(!post.id.startsWith('virtual-') ||
              post.id.includes('profile')) && (
              <CommentsList
                postId={realPostId || post.id}
                isAuthorized={isAuthorized}
              />
            )}
          </div>
        </div>

        {/* Низ: инфо + форма добавления комментария */}
        <div className="border-dark-100 flex flex-col pt-4">
          <PostInfo createdDate={post.createdAt} isAuthorized={isAuthorized} />
          {isOwner &&
            (!post.id.startsWith('virtual-') ||
              post.id.includes('profile')) && (
              <AddComment postId={realPostId || post.id} />
            )}
        </div>
      </div>
    </div>
  );
};
