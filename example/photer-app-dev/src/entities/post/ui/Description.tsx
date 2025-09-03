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

  const visibleDescription = description.slice(0, isShowMore ? undefined : 85);
  const isLongDescription = description.length > 85;

  return (
    <Scrollbar>
      <div className="regular-text-14 h-full">
        <span className="break-words">
          {visibleDescription}
          {isLongDescription && !isShowMore && '...'}
        </span>
        {isLongDescription && (
          <Button
            variant="text"
            className="regular-text-14 ml-1 h-min cursor-pointer border-none p-0 underline underline-offset-2"
            onClick={handleClick}
          >
            {isShowMore ? 'Hide' : 'Show more'}
          </Button>
        )}
      </div>
    </Scrollbar>
  );
};
