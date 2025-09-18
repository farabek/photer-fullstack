'use client';

import { ReactNode, useState } from 'react';
import { Button, Scrollbar } from '@/shared/ui';

type Props = {
  description: string;
};

export const Description = ({ description }: Props): ReactNode => {
  const [isShowMore, setIsShowMore] = useState(false);

  if (!description) {
    return null;
  }

  const handleClick = (): void => {
    setIsShowMore(!isShowMore);
  };

  const shouldTruncate = description.length > 50;
  const visibleDescription =
    !isShowMore && shouldTruncate ? description.slice(0, 50) : description;

  return (
    <Scrollbar>
      <div className="regular-text-14 h-full">
        <span className="block break-words">
          {visibleDescription}
          {!isShowMore && '...'}
        </span>
        <button
          className="regular-text-14 text-accent-500 mt-1 inline-block h-min cursor-pointer border-none bg-transparent p-0 underline underline-offset-2"
          onClick={handleClick}
        >
          {isShowMore ? 'Hide' : 'Show more'}
        </button>
      </div>
    </Scrollbar>
  );
};
