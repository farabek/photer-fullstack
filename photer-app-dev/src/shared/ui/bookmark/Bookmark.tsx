import React, { ReactNode } from 'react';
import { IconSprite } from '../icon/IconSprite';

export const Bookmark = (): ReactNode => {
  const [isAdded, setIsAdded] = React.useState(false);
  return (
    <button className="outline-none" onClick={() => setIsAdded(!isAdded)}>
      <IconSprite
        iconName={isAdded ? 'bookmark' : 'bookmark-outline'}
        className="cursor-pointer"
        fill="white"
      />
    </button>
  );
};
