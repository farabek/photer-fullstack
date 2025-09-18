'use client';
import { IconSprite } from '@/shared/ui';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onCloseAction: () => void;
};

export const PostModalWrapper = ({
  children,
  onCloseAction,
}: Props): ReactNode => {
  return (
    <div className="fixed top-[84px] left-[124px] z-10 h-[380px] w-[972px] border border-gray-600">
      <button
        onClick={() => onCloseAction()}
        className="absolute top-[-8px] right-[-8px] z-20 cursor-pointer rounded-full bg-black/50 p-1 transition-colors outline-none hover:bg-black/70"
      >
        <IconSprite iconName="close" />
      </button>
      {children}
    </div>
  );
};
