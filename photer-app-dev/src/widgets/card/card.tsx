import { cn } from '@/shared/lib/cn';
import React, { ComponentPropsWithoutRef, ReactElement } from 'react';

type Props = {
  className?: string;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<'div'>;

export function Card({ children, className, ...rest }: Props): ReactElement {
  return (
    <div
      {...rest}
      className={cn(
        'bg-dark-500 border-dark-100 min-h-[100px] min-w-[100px] rounded-[1px] border',
        className
      )}
    >
      {children}
    </div>
  );
}
