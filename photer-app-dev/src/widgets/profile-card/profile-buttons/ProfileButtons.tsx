'use client';

import { Button } from '@/shared/ui';
import { ReactElement } from 'react';
import { appLogger } from '@/shared/lib/appLogger';

type Props = {
  isOwner: boolean;
  callback?: () => void;
};

export const ProfileButtons = ({ isOwner, callback }: Props): ReactElement => {
  const handleProfileSettingsClick = () => {
    appLogger.profileSettings('PROFILE_SETTINGS_BUTTON_CLICKED', {
      isOwner,
      timestamp: new Date().toISOString(),
      component: 'ProfileButtons',
    });

    if (callback) {
      callback();
    }
  };

  const handleFollowClick = () => {
    appLogger.info('ProfileButtons', 'FOLLOW_BUTTON_CLICKED', {
      isOwner,
      timestamp: new Date().toISOString(),
    });

    if (callback) {
      callback();
    }
  };

  return (
    <div className={'flex gap-3'}>
      {!isOwner && (
        <Button variant={'primary'} onClick={handleFollowClick}>
          Follow
        </Button>
      )}
      <Button
        variant={'secondary'}
        onClick={isOwner ? handleProfileSettingsClick : callback}
      >
        {isOwner ? 'Profile Settings' : 'Send Message'}
      </Button>
    </div>
  );
};
