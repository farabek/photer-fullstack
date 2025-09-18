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

async function getPosts(): Promise<Posts> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/posts?pageNumber=1&pageSize=8&sortDirection=desc&sortBy=createdAt`
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
  const posts =
    postsResult.status === 'fulfilled' ? postsResult.value.items : [];

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
