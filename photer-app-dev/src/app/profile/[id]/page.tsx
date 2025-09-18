// src/app/profile/[id]/page.tsx
import { ProfileCard } from '@/widgets/profile-card/ui/ProfileCard';
import { ReactElement } from 'react';
import { getUserId } from '@/shared/lib/ssr/getUserId';
import { cookies } from 'next/headers';

export default async function SSRProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ postId?: string }>;
}): Promise<ReactElement> {
  const { id: profileId } = await params;
  const { postId } = await searchParams;
  let isProfileOwner = false;
  const userId = await getUserId();

  console.log('Profile Page:', {
    profileId,
    userId,
    isOwner: userId == profileId,
  });

  if (userId) {
    isProfileOwner = userId == profileId ? true : false;
  }

  let posts = null;
  let profile = null;

  try {
    const resToPosts = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/posts/users/${profileId}?pageNumber=1&pageSize=8&sortDirection=desc&sortBy=createdAt`,
      {
        cache: 'no-store',
      }
    );
    if (!resToPosts.ok) {
      throw new Error(
        `Failed to fetch posts: ${resToPosts.status} ${resToPosts.statusText}`
      );
    }
    posts = await resToPosts.json();
    console.log('Posts fetched:', {
      profileId,
      postsCount: posts?.items?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching posts for profile:', error);
    posts = { items: [] }; // fallback
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    console.log('Profile fetch:', {
      isOwner: isProfileOwner,
      profileId,
      hasToken: !!accessToken,
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Передаём токен только если пользователь - владелец профиля
    if (accessToken && isProfileOwner) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // Для владельца профиля используем /auth/me (данные пользователя)
    // Для других пользователей используем /profile/:id
    const profileUrl = isProfileOwner
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth/me`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${profileId}`;

    console.log('Fetching profile from:', profileUrl);

    const getProfile = await fetch(profileUrl, {
      cache: 'no-store',
      headers,
    });

    console.log('Profile fetch response:', {
      url: profileUrl,
      status: getProfile.status,
      statusText: getProfile.statusText,
    });
    if (getProfile.ok) {
      profile = await getProfile.json();
      console.log('Profile data received');
    } else if (getProfile.status === 401) {
      // Unauthorized - profile may be private or require auth
      console.warn('Profile fetch unauthorized, using fallback');
      profile = null;
    } else {
      console.error('Profile fetch failed:', {
        status: getProfile.status,
        statusText: getProfile.statusText,
      });
      throw new Error(
        `Failed to fetch profile: ${getProfile.status} ${getProfile.statusText}`
      );
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    profile = null; // fallback
  }

  return (
    <div className={'h-full w-full px-[24px] pt-9'}>
      <ProfileCard
        profileId={profileId}
        isOwner={isProfileOwner}
        isAuthorized={!!userId}
        posts={posts}
        profile={profile}
        postId={postId}
      />
    </div>
  );
}
