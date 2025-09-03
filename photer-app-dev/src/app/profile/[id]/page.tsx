// src/app/profile/[id]/page.tsx
import { ProfileCard } from '@/widgets/profile-card/ui/ProfileCard';
import { ReactElement } from 'react';
import { getUserId } from '@/shared/lib/ssr/getUserId';

export default async function SSRProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<ReactElement> {
  const { id: profileId } = await params;
  let isProfileOwner = false;
  const userId = await getUserId();

  if (userId) {
    isProfileOwner = userId == profileId ? true : false;
  }

  const resToPosts = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/posts/users/${profileId}?pageNumber=1&pageSize=8&sortDirection=desc&sortBy=createdAt`,
    {
      cache: 'no-store',
    }
  );
  const posts = await resToPosts.json();

  const getProfile = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/profile/user/${profileId}`,
    {
      cache: 'no-store',
    }
  );

  const profile = await getProfile.json();

  return (
    <div className={'h-full w-full px-[24px] pt-9'}>
      <ProfileCard
        profileId={profileId}
        isOwner={isProfileOwner}
        isAuthorized={!!userId}
        posts={posts}
        profile={profile}
      />
    </div>
  );
}
