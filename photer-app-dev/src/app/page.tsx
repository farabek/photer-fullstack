// src/app/page.tsx
import { ReactElement } from 'react';
import { UsersCount } from '@/entities/user/ui/UsersCount';
import { Posts } from '@/features/posts/lib/post.types';
import { Toaster } from '@/shared/ui';
import { PublicPostItem } from '@/features/posts/ui/public-post/PublicPostItem';

async function getUsersCount(): Promise<number> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/count`);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch users count: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    // API returns { count: number }
    return typeof data === 'number' ? data : Number(data?.count ?? 0);
  } catch (error) {
    console.error('Error fetching users count:', error);
    throw error;
  }
}

// Настройка: брать первое или последнее фото из поста
const PHOTO_SELECTION_MODE = 'last'; // 'first' или 'last'

async function getPosts(): Promise<Posts> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/posts?pageNumber=1&pageSize=50&sortDirection=desc&sortBy=createdAt`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export const revalidate = 60;

export default async function HomePage(): Promise<ReactElement> {
  const usersCountData = getUsersCount();
  const postsData = getPosts();

  const [usersCountResult, postsResult] = await Promise.allSettled([
    usersCountData,
    postsData,
  ]);

  const usersCount =
    usersCountResult.status === 'fulfilled' ? usersCountResult.value : 0;
  const allPosts =
    postsResult.status === 'fulfilled' ? postsResult.value.items : [];

  // Группируем посты по пользователям и берем фото из КАЖДОГО поста согласно настройке
  const userPhotos = new Map();
  allPosts.forEach((post) => {
    const userId = post.owner?.userId;
    const userName = post.owner?.userName;

    const selectedPhotoIndex =
      PHOTO_SELECTION_MODE === 'last' ? (post.photos?.length || 1) - 1 : 0;
    const selectedPhoto = post.photos?.[selectedPhotoIndex];

    console.log('=== PROCESSING POST ===', {
      postId: post.id,
      userId,
      userName,
      postPhotosCount: post.photos?.length || 0,
      photoSelectionMode: PHOTO_SELECTION_MODE,
      selectedPhotoIndex,
      selectedPhoto,
    });

    if (userId && post.photos && post.photos.length > 0) {
      if (!userPhotos.has(userId)) {
        userPhotos.set(userId, {
          userId,
          userName,
          photos: [],
          posts: [],
          latestPostId: post.id,
          latestCreatedAt: post.createdAt,
        });
        console.log('=== CREATED USER ENTRY ===', { userId, userName });
      }

      // Добавляем фото из поста согласно настройке
      const userData = userPhotos.get(userId);
      const beforeCount = userData.photos.length;
      const photoIndex =
        PHOTO_SELECTION_MODE === 'last' ? post.photos.length - 1 : 0;
      const photoToAdd = post.photos[photoIndex];
      userData.photos.push(photoToAdd);

      // Сохраняем ссылку на пост для получения описания
      if (!userData.posts.some((p: typeof post) => p.id === post.id)) {
        userData.posts.push(post);
      }

      console.log(
        `=== ADDED ${PHOTO_SELECTION_MODE.toUpperCase()} PHOTO TO USER ===`,
        {
          userId,
          userName,
          postId: post.id,
          photoIndex,
          addedPhoto: photoToAdd,
          totalBefore: beforeCount,
          totalAfter: userData.photos.length,
        }
      );

      // Обновляем самый свежий пост если нужно
      if (new Date(post.createdAt) > new Date(userData.latestCreatedAt)) {
        userData.latestPostId = post.id;
        userData.latestCreatedAt = post.createdAt;
      }
    } else {
      console.log('=== SKIPPED POST ===', {
        postId: post.id,
        userId,
        hasPhotos: !!(post.photos && post.photos.length > 0),
        reason: 'missing userId or no photos',
      });
    }
  });

  // Преобразуем в формат постов для отображения
  // Создаем виртуальный пост с id пользователя для модального окна
  const posts = Array.from(userPhotos.values()).map((userData) => {
    // Используем описание последнего поста или общее описание
    const sortedPosts = userData.posts.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const lastPostDescription =
      sortedPosts.length > 0
        ? sortedPosts[0].description
        : `Фото пользователя ${userData.userName}`;

    return {
      id: `virtual-${userData.userId}`, // Уникальный id для виртуального поста
      description: lastPostDescription, // Используем описание последнего поста
      tags: [],
      createdAt: userData.latestCreatedAt,
      updatedAt: userData.latestCreatedAt,
      status: true,
      photos: userData.photos,
      latestPostId: userData.latestPostId, // Real post ID for comments
      owner: {
        userId: userData.userId,
        userName: userData.userName,
        avatarUrl: null,
        firstName: null,
        lastName: null,
      },
    };
  });

  console.log('=== HOME PAGE DEBUG ===', {
    totalPosts: allPosts.length,
    uniqueUsers: userPhotos.size,
    finalPostsCount: posts.length,
    usersWithPosts: Array.from(userPhotos.entries()).map(([userId, data]) => ({
      userId,
      userName: data.userName,
      totalPhotos: data.photos.length,
      postsProcessed: allPosts.filter((p) => p.owner?.userId === userId).length,
    })),
    postsWithMultiplePhotos: posts.filter((p) => p.photos?.length > 1).length,
    timestamp: new Date().toISOString(),
  });

  const errors: string[] = [
    usersCountResult.status === 'rejected'
      ? usersCountResult.reason.message
      : null,
    postsResult.status === 'rejected' ? postsResult.reason.message : null,
  ];

  return (
    <main className="flex flex-1 flex-col items-center px-4">
      <Toaster messages={errors} type={'error'} />
      <UsersCount usersCount={usersCount} />

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        {posts &&
          posts.map((post) => <PublicPostItem key={post.id} post={post} />)}
      </div>
    </main>
  );
}
