import React, { ReactNode } from 'react';
import { IconSprite } from '../icon/IconSprite';

export const Like = (): ReactNode => {
  const [isLiked, setIsLiked] = React.useState(false);
  return (
    <button className="outline-none" onClick={() => setIsLiked(!isLiked)}>
      <IconSprite
        iconName={isLiked ? 'heart' : 'heart-outline'}
        className="cursor-pointer"
        fill={isLiked ? '#CC1439' : 'white'}
      />
    </button>
  );
};
