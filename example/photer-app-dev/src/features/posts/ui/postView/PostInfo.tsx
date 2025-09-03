import { Bookmark } from '@/shared/ui/bookmark/Bookmark';
import { CircleAvatar } from '@/shared/ui/circleAvatar/CircleAvatar';
import { IconSprite } from '@/shared/ui/icon/IconSprite';
import { Like } from '@/shared/ui/like/Like';
import { ReactNode } from 'react';
import { useCreateTime } from '../../hooks/view/useTimePost';

type Props = { createdDate: string; isAuthorized?: boolean };

export const PostInfo = ({ createdDate, isAuthorized }: Props): ReactNode => {
  const date = useCreateTime(createdDate);
  return (
    <div className="border-dark-100 flex flex-col border-t-[1px] border-b-[1px] px-[24px] py-[12px]">
      {isAuthorized && (
        <div className="flex justify-between">
          <div className="flex gap-[26px]">
            <Like />
            <IconSprite
              iconName="paper-plane"
              fill="white"
              className="cursor-pointer"
            />
          </div>
          <Bookmark />
        </div>
      )}
      <div className="mt-[19px] flex items-center gap-[12px]">
        <div className="flex">
          <CircleAvatar src={'/images/expired.png'} className="z-2" />
          <CircleAvatar
            src={'/images/expired.png'}
            className="z-1 ml-[-12px]"
          />
          <CircleAvatar
            src={'/images/expired.png'}
            className="z-0 ml-[-12px]"
          />
        </div>
        <span className="text-light-100">2 243 &quot;Like&quot;</span>
      </div>
      <span className="text-light-900 mt-[5px]">{date}</span>
    </div>
  );
};
