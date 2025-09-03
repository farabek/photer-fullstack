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
    <div className="fixed top-1/2 left-1/2 z-10 mx-auto flex w-full max-w-[972px] -translate-x-1/2 -translate-y-1/2">
      <button
        onClick={() => onCloseAction()}
        className="absolute top-[-34px] right-[-38px] cursor-pointer outline-none"
      >
        <IconSprite iconName="close" />
      </button>
      {children}
    </div>
  );
};
