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
            <Image
              key={index}
              src={photo}
              alt="Post image"
              fill
              unoptimized
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
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
