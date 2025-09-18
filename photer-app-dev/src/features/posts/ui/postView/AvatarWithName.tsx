import { CircleAvatar } from '@/shared/ui/circleAvatar/CircleAvatar';
import { ReactNode } from 'react';

type Props = {
  avatarUrl: string | null;
  userName: string | null;
  className?: string;
  avatarClassName?: string;
};

export const AvatarWithName = ({
  avatarUrl,
  userName,
  className,
  avatarClassName,
}: Props): ReactNode => {
  return (
    <div className="flex items-center gap-[12px] py-[12px]">
      <CircleAvatar
        src={avatarUrl || '/images/expired.png'}
        className={avatarClassName}
      />
      <h3 className={`font-bold ${className || 'text-light-100'}`}>
        {userName || 'Nicname'}
      </h3>
    </div>
  );
};
