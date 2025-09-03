'use client';

import { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { cn } from '@/shared/lib/cn';

export type ScrollbarProps = {
  children: ReactNode;
  className?: string;
  /** maxHeight viewport in pixels */
  maxHeight?: number | string;
  /** maxWidth viewport in pixels */
  maxWidth?: number | string;
  type?: ScrollArea.ScrollAreaProps['type'];
} & ComponentPropsWithRef<'div'>;

export const Scrollbar = ({
  children,
  className,
  maxHeight = '100%',
  maxWidth = '100%',
  type = 'auto',
  ...rest
}: ScrollbarProps): ReactElement => {
  const classNames = {
    root: cn('overflow-hidden', className),
    scrollbar: 'touch-none select-none flex',
    thumb:
      'cursor-pointer relative flex-grow px-1 rounded-lg before:content-[""] before:absolute before:w-1 before:h-full before:bg-dark-300 before:rounded-[3px] before:transition-[background-color] before:duration-[200ms] hover:before:bg-light-900',
    viewport: 'w-full h-full',
  };

  const maxHeightConverted =
    typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
  const maxWidthConverted =
    typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  const viewportStyles = {
    maxHeight: maxHeightConverted,
    maxWidth: maxWidthConverted,
  };

  return (
    <ScrollArea.Root asChild type={type}>
      <div className={classNames.root} {...rest}>
        <ScrollArea.Viewport
          className={classNames.viewport}
          style={viewportStyles}
        >
          {children}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className={cn(classNames.scrollbar, 'w-[14px] py-[3px]')}
          orientation={'vertical'}
        >
          <ScrollArea.Thumb className={classNames.thumb} />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar
          className={cn(classNames.scrollbar, 'h-[14px] flex-col px-[3px]')}
          orientation={'horizontal'}
        >
          <ScrollArea.Thumb
            className={cn(
              classNames.thumb,
              'px-0 py-1.5 before:h-1 before:w-full'
            )}
          />
        </ScrollArea.Scrollbar>
      </div>
    </ScrollArea.Root>
  );
};
