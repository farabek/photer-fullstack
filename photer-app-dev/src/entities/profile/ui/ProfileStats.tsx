'use client';
import { ReactElement } from 'react';

type Props = {
  following: number;
  followers: number;
  publications: number;
};

export const ProfileStats = ({
  following,
  followers,
  publications,
}: Props): ReactElement => {
  return (
    <div className={'flex gap-25'}>
      <span className={'regular-text-14'}>
        <strong>{following}</strong>
        <br /> Following
      </span>
      <span className={'regular-text-14'}>
        <strong>{followers}</strong>
        <br /> Followers
      </span>
      <span className={'regular-text-14'}>
        <strong>{publications}</strong>
        <br /> Publications
      </span>
    </div>
  );
};
