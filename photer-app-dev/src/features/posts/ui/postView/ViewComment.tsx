import { Like } from '@/shared/ui/like/Like';
import Image from 'next/image';
import { ReactNode } from 'react';

type Props = {
  comment?: string;
  userName?: string;
  avatarUrl?: string | null;
  createdAt?: string;
  isAuthorized?: boolean;
};

export const ViewComment = ({
  comment,
  userName = 'Nicname',
  avatarUrl,
  createdAt,
  isAuthorized,
}: Props): ReactNode => {
  // Форматируем дату
  const formatDate = (dateString?: string) => {
    if (!dateString) return '2 Hours ago';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours} Hours ago`;
      if (diffHours < 48) return 'Yesterday';
      return date.toLocaleDateString();
    } catch {
      return '2 Hours ago';
    }
  };

  return (
    <div className="flex gap-[12px]">
      <div className="relative h-[36px] min-w-[36px] overflow-hidden rounded-full">
        <Image
          src={avatarUrl || '/images/expired.png'}
          alt="User avatar"
          fill
          sizes="36px"
          className="object-cover"
        />
      </div>

      <div className="flex w-full flex-col">
        <p className="text-light-100 text-[14px] leading-tight">
          <span className="mr-1 font-bold">{userName}</span>
          {comment}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <div className="text-light-900 flex gap-[12px] text-[12px]">
            <span>{formatDate(createdAt)}</span>
            <span>Like: 0</span>
            <span className="cursor-pointer hover:underline">Answer</span>
          </div>
          {isAuthorized && <Like />}
        </div>
      </div>
    </div>
  );
};
