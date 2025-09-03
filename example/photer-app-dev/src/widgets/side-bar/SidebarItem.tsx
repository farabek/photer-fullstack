// srcwidgets/side-bar/SidebarItem.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HoverDiv from './HoverDiv';
import { cn } from '@/shared/lib/cn';
import { IconSprite } from '@/shared/ui';
import { SpriteName } from 'public/icons/spriteNames';
import { authApi } from '@/features/auth/api/authApi';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/shared/state/store';
import { openModal } from '@/shared/state/slices/modalSlice';

type SidebarItemProps = {
  title: string | undefined;
  defaultIconName: SpriteName;
  activeIconName: SpriteName;
  path?: string;
  isSidebarOpen: boolean;
};

export default function SidebarItem({
  title,
  defaultIconName,
  activeIconName,
  path,
  isSidebarOpen,
}: SidebarItemProps): React.JSX.Element {
  const pathname = usePathname();
  const userId = useSelector(
    (state: RootState) => authApi.endpoints.getMe.select()(state).data?.userId
  );
  const dispatch = useAppDispatch();

  const iconAndText = (
    <HoverDiv
      isActive={pathname === path}
      className={cn('flex w-full items-center gap-5 px-[20px]', {
        'min-w-[40px] flex-col items-start gap-1 rounded-full px-[12px]':
          !isSidebarOpen,
      })}
    >
      <IconSprite
        iconName={isSidebarOpen ? defaultIconName : activeIconName}
        className="mt-[4px] fill-white"
        width="24"
        height="24"
      />
      <p
        className={cn('text-sm font-semibold', {
          'text-[10px]': !isSidebarOpen,
        })}
      >
        {isSidebarOpen && title}
      </p>
    </HoverDiv>
  );

  if (title === 'Profile' && userId) {
    path = `/profile/${userId}`;
  }

  if (title === 'Create') {
    return (
      <button
        className="w-full"
        onClick={() => dispatch(openModal({ type: 'post-create' }))}
      >
        {iconAndText}
      </button>
    );
  }

  return <Link href={path ?? '#'}>{iconAndText}</Link>;
}
