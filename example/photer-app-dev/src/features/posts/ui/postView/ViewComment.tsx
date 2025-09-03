import { Like } from '@/shared/ui/like/Like';
import Image from 'next/image';
import { ReactNode } from 'react';

type Props = {
  comment?: string;
  isAuthorized?: boolean;
};

export const ViewComment = ({ comment, isAuthorized }: Props): ReactNode => {
  return (
    <div className="flex gap-[12px]">
      <div className="h-[36px] min-w-[36px] overflow-hidden rounded-full">
        <Image
          src="/images/expired.png"
          alt="User avatar"
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full flex-col">
        <p className="text-light-100 text-[14px] leading-tight">
          <span className="mr-1 font-bold">Nicname</span>
          {comment}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <div className="text-light-900 flex gap-[12px] text-[12px]">
            <span>2 Hours ago</span>
            <span>Like: 1</span>
            <span className="cursor-pointer hover:underline">Answer</span>
          </div>
          {isAuthorized && <Like />}
        </div>
      </div>
    </div>
  );
};
