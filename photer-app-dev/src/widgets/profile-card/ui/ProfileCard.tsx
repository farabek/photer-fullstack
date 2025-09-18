'use client';
import Image from 'next/image';
import defaultAvatar from '../../../../public/images/defaultAvatar.png';
import { ProfileButtons } from '@/widgets/profile-card/profile-buttons/ProfileButtons';
import { ProfileStats } from '@/entities/profile/ui/ProfileStats';
import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { EditProfile } from '@/features/edit-profile/EditProfile';
import { PostsList } from '@/features/posts/ui/postFeed/PostsList';
import { Posts } from '@/features/posts/lib/post.types';
import { profileApi } from '@/features/edit-profile/api/profileApi';
import { RootState, useAppDispatch } from '@/shared/state/store';
import { useSelector } from 'react-redux';
import { ProfileGenIfo } from '@/features/edit-profile/lib/profile.types';
import { appLogger } from '@/shared/lib/appLogger';

type Props = {
  isOwner: boolean;
  isAuthorized: boolean;
  profileId?: string;
  posts?: Posts;
  profile?: ProfileGenIfo;
  postId?: string;
  username?: string;
};

export const ProfileCard = ({
  isOwner,
  isAuthorized,
  profileId,
  posts,
  profile,
  postId,
}: Props): ReactElement => {
  const dispatch = useAppDispatch();
  const [isEditProfile, setIsEditProfile] = useState(false);

  const user = useSelector(
    (state: RootState) =>
      profileApi.endpoints.getCurrentUser.select()(state).data
  );

  // Логируем инициализацию ProfileCard
  useEffect(() => {
    appLogger.profileSettings('PROFILE_CARD_INITIALIZED', {
      isOwner,
      isAuthorized,
      profileId,
      hasUser: !!user,
      hasProfile: !!profile,
      isEditProfile,
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Логируем изменения состояния редактирования профиля
  useEffect(() => {
    appLogger.profileSettings('PROFILE_CARD_EDIT_STATE_CHANGED', {
      isEditProfile,
      isOwner,
      isAuthorized,
      profileId,
      hasUser: !!user,
      timestamp: new Date().toISOString(),
    });
  }, [isEditProfile, isOwner, isAuthorized, profileId, user]);

  useEffect(() => {
    if ((!user && profile) || (profile && user?.id !== profile.id)) {
      const thunk = profileApi.util.upsertQueryData(
        'getCurrentUser',
        undefined,
        profile
      );
      dispatch(thunk);
    }
  }, [dispatch, user, profile]);

  const handleOpenEditProfile = () => {
    appLogger.profileSettings('PROFILE_SETTINGS_MODAL_OPENING', {
      isOwner,
      isAuthorized,
      profileId,
      hasUser: !!user,
      timestamp: new Date().toISOString(),
    });
    setIsEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    appLogger.profileSettings('PROFILE_SETTINGS_MODAL_CLOSING', {
      isOwner,
      isAuthorized,
      profileId,
      hasUser: !!user,
      timestamp: new Date().toISOString(),
    });
    setIsEditProfile(false);
  };

  if (isEditProfile) {
    appLogger.profileSettings('PROFILE_SETTINGS_MODAL_RENDERED', {
      isOwner,
      isAuthorized,
      profileId,
      hasUser: !!user,
      timestamp: new Date().toISOString(),
    });
    return <EditProfile onClose={handleCloseEditProfile} />;
  }

  // Используем данные из profile (SSR) в приоритете, затем из user (Redux) только для владельца
  const profileData = profile || (isOwner ? user : null);
  // Если есть посты, берем username из первого поста
  const usernameFromPosts = posts?.items?.[0]?.owner?.userName;

  // Для авторизованного пользователя на своей странице приоритет у user.username
  // Если username нет, используем profileId как fallback (он совпадает с userId)
  const username =
    (isOwner && user?.username) ||
    profileData?.username ||
    usernameFromPosts ||
    profileId ||
    'UserName';

  const fullName = profileData
    ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()
    : '';

  // Получаем аватар - если это массив, берем первый элемент
  const avatarUrl = profileData?.avatarUrl
    ? Array.isArray(profileData.avatarUrl)
      ? profileData.avatarUrl[0]
      : profileData.avatarUrl
    : null;

  return (
    <div>
      <div className={'flex gap-9'}>
        <div className="relative h-[204px] w-[204px] flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          <Image
            src={avatarUrl || defaultAvatar}
            alt="avatar"
            fill
            sizes="204px"
            className={'object-cover'}
            priority
            unoptimized
          />
        </div>
        <div className={'flex w-full flex-col gap-5'}>
          <div className={'flex justify-between'}>
            <div className={'flex flex-col'}>
              <h2 className={'h1-text'}>{username}</h2>
              {fullName && (
                <p className={'text-light-900 text-base'}>{fullName}</p>
              )}
            </div>
            {isAuthorized && isOwner && (
              <ProfileButtons
                callback={handleOpenEditProfile}
                isOwner={isOwner}
              />
            )}
          </div>

          <ProfileStats
            following={profile?.following || 0}
            followers={profile?.followers || 0}
            publications={profile?.publications || 0}
          />
          <div>
            <p>
              {profileData?.aboutMe || (
                <>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco{' '}
                  <Link href={'#'} className={'regular-link'}>
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      {profileId && (
        <>
          <PostsList ssrPosts={posts} profileId={profileId} postId={postId} />
        </>
      )}
    </div>
  );
};
