'use client';
import { ReactElement, useState } from 'react';
import Image from 'next/image';
import { PostType } from '@/features/posts/lib/post.types';
import { PostModal } from '@/widgets/posts';

type Props = {
  post: PostType;
  allUserPosts?: PostType[]; // Все посты пользователя для создания виртуальной карусели
};

export const PostItem = ({ post, allUserPosts }: Props): ReactElement => {
  const [isOpenPost, setIsOpenPost] = useState(false);

  // Создаем виртуальный пост со всеми фото пользователя (как на главной странице)
  const createVirtualPostWithAllPhotos = (): PostType => {
    if (!allUserPosts || allUserPosts.length === 0) {
      return post; // Fallback к оригинальному посту
    }

    // Собираем все фото пользователя из всех постов
    const allPhotos: string[] = [];
    allUserPosts.forEach((userPost) => {
      if (userPost.photos && userPost.photos.length > 0) {
        allPhotos.push(...userPost.photos);
      }
    });

    // Создаем виртуальный пост с ID как на главной странице
    const virtualPost: PostType = {
      ...post,
      id: `virtual-profile-${post.owner.id}`,
      photos: allPhotos,
      description: `All photos from ${post.owner.userName}`,
      totalCount: allPhotos.length,
    };

    console.log('=== VIRTUAL POST CREATED FOR PROFILE ===', {
      originalPostId: post.id,
      virtualPostId: virtualPost.id,
      userId: post.owner.id,
      userName: post.owner.userName,
      originalPhotosCount: post.photos?.length || 0,
      totalPhotosFromAllPosts: allPhotos.length,
      allUserPostsCount: allUserPosts.length,
      allPhotos: allPhotos,
      timestamp: new Date().toISOString(),
    });

    return virtualPost;
  };

  // Логирование данных поста
  console.log('=== POST ITEM DEBUG ===', {
    postId: post.id,
    hasPhotos: !!(post.photos && post.photos.length > 0),
    photosCount: post.photos?.length || 0,
    firstPhoto: post.photos?.[0],
    photosArray: post.photos,
    hasAllUserPosts: !!(allUserPosts && allUserPosts.length > 0),
    allUserPostsCount: allUserPosts?.length || 0,
    willCreateVirtualPost: !!(allUserPosts && allUserPosts.length > 1),
    timestamp: new Date().toISOString(),
  });

  return (
    <>
      {/* Debug logging for PostItem -> PostModal */}
      {isOpenPost &&
        console.log('=== POST ITEM -> POST MODAL DEBUG ===', {
          postId: post.id,
          description: post.description,
          timestamp: new Date().toISOString(),
        })}
      <div
        className={'relative h-57 w-[250px]'}
        onClick={() => setIsOpenPost(true)}
        data-testid="post-item"
      >
        {post.photos.length > 0 ? (
          <div className="relative h-full w-full">
            <img
              src={post.photos[0]}
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
      {isOpenPost &&
        (() => {
          console.log('=== POST MODAL OPEN DEBUG - FROM POST ITEM ===', {
            postId: post.id,
            postDescription: post.description,
            allUserPostsCount: allUserPosts?.length || 0,
            allUserPostsDescriptions:
              allUserPosts?.map((p) => ({
                id: p.id,
                description: p.description,
              })) || [],
            timestamp: new Date().toISOString(),
          });
          return (
            <PostModal
              post={post}
              allUserPosts={allUserPosts}
              onCloseAction={() => setIsOpenPost(false)}
            />
          );
        })()}
    </>
  );
};
