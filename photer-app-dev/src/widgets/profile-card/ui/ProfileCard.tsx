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
};

export const ProfileCard = ({
  isOwner,
  isAuthorized,
  profileId,
  posts,
  profile,
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

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username
    : 'URLProfile';
  return (
    <div>
      <div className={'flex gap-9'}>
        <div className="h-[204px] w-[204px] flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          <Image
            src={user?.avatarUrl || defaultAvatar}
            alt="avatar"
            width={204}
            height={204}
            className={'h-full w-full object-cover'}
            priority
            unoptimized
          />
        </div>
        <div className={'flex w-full flex-col gap-5'}>
          <div className={'flex justify-between'}>
            <h2 className={'h1-text'}>{displayName}</h2>
            {isAuthorized && (
              <ProfileButtons
                callback={handleOpenEditProfile}
                isOwner={isOwner}
              />
            )}
          </div>

          <ProfileStats following={2218} followers={2218} publications={2218} />
          <div>
            <p>
              {user?.aboutMe || (
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
      {profileId && <PostsList ssrPosts={posts} profileId={profileId} />}
    </div>
  );
};
