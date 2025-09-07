// src/widgets/side-bar/HoverDiv.tsx

import { cn } from '@/shared/lib/cn';
import React from 'react';

const HoverDiv = React.memo(function HoverDiv({
  isActive,
  className,
  onClick,
  ...rest
}: React.HtmlHTMLAttributes<HTMLDivElement> & {
  isActive?: boolean;
}): React.JSX.Element {
  const handleClick = React.useCallback(onClick, [onClick]);

  return (
    <div
      {...rest}
      onClick={handleClick}
      className={cn(
        'cursor-pointer rounded-xl p-2 transition-all hover:bg-zinc-800',
        { 'bg-zinc-800': isActive },
        className
      )}
    />
  );
});

HoverDiv.displayName = 'HoverDiv';

export default HoverDiv;
