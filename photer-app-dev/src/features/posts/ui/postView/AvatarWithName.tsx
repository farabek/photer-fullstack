import { CircleAvatar } from '@/shared/ui/circleAvatar/CircleAvatar';
import { ReactNode } from 'react';

type Props = {
  avatarUrl: string | null;
  userName: string | null;
};

export const AvatarWithName = ({ avatarUrl, userName }: Props): ReactNode => {
  return (
    <div className="flex items-center gap-[12px] py-[12px]">
      <CircleAvatar src={avatarUrl || '/images/expired.png'} />
      <h3 className="text-light-100 font-bold">{userName || 'Nicname'}</h3>
    </div>
  );
};
