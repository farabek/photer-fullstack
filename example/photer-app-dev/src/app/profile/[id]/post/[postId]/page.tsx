import { notFound } from 'next/navigation';
import { PostType } from '@/features/posts/lib/post.types';
import { ProfileCard } from '@/widgets/profile-card/ui/ProfileCard';
import { ReactElement } from 'react';
import { getUserId } from '@/shared/lib/ssr/getUserId';
import { WrapPostModalSSR } from '@/widgets/posts';

export default async function SSRPublicPost({
  params,
}: {
  params: Promise<{ id: string; postId: string }>;
}): Promise<ReactElement> {
  const { id: profileId, postId } = await params;
  let isProfileOwner = false;
  const userId = await getUserId();

  if (userId) {
    isProfileOwner = userId == profileId ? true : false;
  }

  const getPost = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${postId}`,
    {
      cache: 'no-store',
    }
  );

  const getProfile = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/profile/user/${profileId}`,
    {
      cache: 'no-store',
    }
  );

  if (!getPost.ok) {
    return notFound();
  }

  const post: PostType = await getPost.json();
  const profile = await getProfile.json();
  return (
    <div className={'h-full max-w-7xl px-[24px] pt-9'}>
      <ProfileCard
        isOwner={isProfileOwner}
        isAuthorized={!!userId}
        profileId={profileId}
        profile={profile}
      />
      <WrapPostModalSSR profileId={profileId} post={post} />
    </div>
  );
}
