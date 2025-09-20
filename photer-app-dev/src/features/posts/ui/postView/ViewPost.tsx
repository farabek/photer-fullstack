'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { PostInfo } from './PostInfo';
import { AddComment } from './AddComment';
import { AvatarWithName } from './AvatarWithName';
import { PostDescription } from './PostDescription';
import { ViewComment } from './ViewComment';
import { Carousel } from '@/shared/ui/carousel/Carousel';
import { PostType } from '../../lib/post.types';

type Props = {
  post: PostType;
  children?: ReactNode;
  isAuthorized: boolean;
  isOwner: boolean;
};

export const ViewPost = ({
  post,
  children,
  isAuthorized,
  isOwner,
}: Props): ReactNode => {
  return (
    <div className="bg-dark-300 border-dark-100 flex h-full w-full overflow-hidden">
      {/* Левая часть — фото со скроллом при необходимости */}
      <div className="flex-1 overflow-y-auto">
        <Carousel className="relative h-full w-full">
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
            <ViewComment isAuthorized={isAuthorized} />
            <ViewComment isAuthorized={isAuthorized} />
          </div>
        </div>

        {/* Низ: инфо + форма добавления комментария */}
        <div className="border-dark-100 flex flex-col pt-4">
          <PostInfo createdDate={post.createdAt} isAuthorized={isAuthorized} />
          {isOwner && <AddComment />}
        </div>
      </div>
    </div>
  );
};
