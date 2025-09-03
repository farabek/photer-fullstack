'use client';

import { Button } from '@/shared/ui';
import { ReactElement } from 'react';

type Props = {
  isOwner: boolean;
  callback?: () => void;
};

export const ProfileButtons = ({ isOwner, callback }: Props): ReactElement => {
  return (
    <div className={'flex gap-3'}>
      {!isOwner && (
        <Button variant={'primary'} onClick={callback}>
          Follow
        </Button>
      )}
      <Button variant={'secondary'} onClick={callback}>
        {isOwner ? 'Profile Settings' : 'Send Message'}
      </Button>
    </div>
  );
};
