import { cn } from '@/shared/lib/cn';
import { IconSprite } from '@/shared/ui';
import Link from 'next/link';

import { ReactElement, ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

export const LegalInfo = ({
  title,
  children,
  className,
}: Props): ReactElement => {
  return (
    <div className={cn('mx-auto flex max-w-[1280px] flex-col', className)}>
      <Link
        href="/sign-up"
        className="mt-[24px] flex gap-[12px] pl-[64px] max-md:pl-[15px]"
      >
        <IconSprite iconName="arrow-back-outline" />
        <span className="max-md:hidden">Back to Sign Up</span>
      </Link>
      <h1 className="h1-text mx-auto mt-[24px] max-md:mt-[-30px]">{title}</h1>
      <div className="mt-[14px] px-[97px] pb-[91px] text-center max-md:px-[15px]">
        {children}
      </div>
    </div>
  );
};
