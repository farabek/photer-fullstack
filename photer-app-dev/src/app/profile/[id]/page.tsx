// src/app/profile/[id]/page.tsx
import { ProfileCard } from '@/widgets/profile-card/ui/ProfileCard';
import { ReactElement } from 'react';
import {
  getUserId,
  isUserAuthorized,
  getValidAccessToken,
} from '@/shared/lib/ssr/getUserId';
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
  const isAuthorized = await isUserAuthorized();

  console.log('PAGE DEBUG - AUTH STATE:', {
    profileId,
    userId,
    isUserIdPresent: !!userId,
    isAuthorized,
    isProfileOwner: userId == profileId,
    timestamp: new Date().toISOString(),
  });

  console.log('PAGE DEBUG - POSTS FETCH:', {
    profileId,
    apiUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/users/${profileId}?pageNumber=1&pageSize=8&sortDirection=desc&sortBy=createdAt`,
    timestamp: new Date().toISOString(),
  });

  // Определяем владельца профиля на основе userId (независимо от авторизации)
  // Авторизация нужна только для доступа к приватным данным
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
    console.log('PAGE DEBUG - POSTS RECEIVED:', {
      profileId,
      postsCount: posts?.items?.length || 0,
      totalCount: posts?.totalCount || 0,
      hasPosts: !!(posts?.items && posts.items.length > 0),
      postIds:
        posts?.items?.map((p: any) => ({
          id: p.id,
          photos: p.photos?.length || 0,
        })) || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching posts for profile:', error);
    posts = { items: [], totalCount: 0 }; // fallback
    console.log('Posts fallback used:', {
      profileId,
      posts,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Получаем действительный access token (с автоматическим обновлением если нужно)
    const accessToken = await getValidAccessToken();

    console.log('Profile fetch:', {
      isOwner: isProfileOwner,
      profileId,
      hasToken: !!accessToken,
      profileIdType: typeof profileId,
      profileIdLength: profileId?.length,
      isAuthorized,
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Передаём токен если пользователь авторизован
    if (accessToken && isAuthorized) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // Сначала попробуем получить публичные данные профиля
    // Если пользователь авторизован и это его профиль, попробуем /auth/me
    let profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${profileId}`;
    let shouldTryAuthMe = isAuthorized && isProfileOwner && accessToken;

    console.log('Fetching profile from:', {
      url: profileUrl,
      isOwner: isProfileOwner,
      isAuthorized,
      shouldTryAuthMe,
      headers: {
        ...headers,
        Authorization: headers.Authorization ? '[PRESENT]' : '[NOT SET]',
      },
    });

    const getProfile = await fetch(profileUrl, {
      cache: 'no-store',
      headers,
    });

    console.log('Profile fetch response:', {
      url: profileUrl,
      status: getProfile.status,
      statusText: getProfile.statusText,
      ok: getProfile.ok,
      headers: Object.fromEntries(getProfile.headers.entries()),
    });

    // Логируем тело ответа для диагностики
    let responseBody = null;
    try {
      responseBody = await getProfile.clone().text();
      console.log('Profile response body:', responseBody);
    } catch (bodyError) {
      console.log('Could not read response body:', bodyError);
    }
    if (getProfile.ok) {
      profile = await getProfile.json();
      console.log('Profile data received from public endpoint');
    } else if (getProfile.status === 404 && shouldTryAuthMe) {
      // Публичный профиль не найден, попробуем /auth/me для владельца
      console.log('Public profile not found, trying /auth/me for owner...');
      try {
        const authMeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/me`;
        const authMeResponse = await fetch(authMeUrl, {
          cache: 'no-store',
          headers,
        });

        console.log('Auth/me response:', {
          url: authMeUrl,
          status: authMeResponse.status,
          ok: authMeResponse.ok,
        });

        if (authMeResponse.ok) {
          profile = await authMeResponse.json();
          console.log('Profile data received from /auth/me');
        } else {
          console.warn('Auth/me failed, using fallback');
          profile = null;
        }
      } catch (authError) {
        console.error('Auth/me request failed:', authError);
        profile = null;
      }
    } else if (getProfile.status === 401) {
      // Unauthorized - profile may be private or require auth
      console.warn('Profile fetch unauthorized, using fallback');
      profile = null;
    } else if (getProfile.status === 404) {
      // Profile not found - normal for non-existent profiles
      console.warn('Profile not found, using fallback');
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

  // Если профиль не найден, но есть посты, создаем базовый профиль из данных постов
  if (!profile && posts?.items?.length > 0) {
    const firstPost = posts.items[0];
    if (firstPost?.owner) {
      profile = {
        id: profileId,
        username: firstPost.owner.userName,
        firstName: firstPost.owner.firstName || '',
        lastName: firstPost.owner.lastName || '',
        avatarUrl: firstPost.owner.avatarUrl || null,
        aboutMe: '',
        publications: posts.totalCount || posts.items.length,
        followers: 0,
        following: 0,
      };
      console.log('Created profile from post data:', {
        profile,
        firstPostOwner: firstPost.owner,
        originalAvatarUrl: firstPost.owner.avatarUrl,
        processedAvatarUrl: profile.avatarUrl,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Синхронизируем счетчик публикаций в профиле с реальными данными постов
  if (profile && posts) {
    const realPublicationsCount = posts.totalCount || posts.items?.length || 0;
    if (profile.publications !== realPublicationsCount) {
      console.log('Publications count mismatch, fixing:', {
        profilePublications: profile.publications,
        realPublicationsCount,
        profileId,
        timestamp: new Date().toISOString(),
      });
      profile.publications = realPublicationsCount;
    }
  }

  console.log('PAGE DEBUG - FINAL AUTH STATE:', {
    profileId,
    userId,
    isAuthorized,
    isProfileOwner,
    willShowProfileSettings: isAuthorized && isProfileOwner,
    hasProfile: !!profile,
    profileSource: profile ? 'api' : 'fallback',
    timestamp: new Date().toISOString(),
  });

  return (
    <div className={'h-full w-full px-[24px] pt-9'}>
      <ProfileCard
        profileId={profileId}
        isOwner={isProfileOwner}
        isAuthorized={isAuthorized}
        posts={posts}
        profile={profile}
        postId={postId}
      />
    </div>
  );
}
