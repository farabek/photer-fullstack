// src/widgets/side-bar/HoverDiv.tsx

import { cn } from '@/shared/lib/cn';

export default function HoverDiv({
  isActive,
  className,
  ...rest
}: React.HtmlHTMLAttributes<HTMLDivElement> & {
  isActive?: boolean;
}): React.JSX.Element {
  return (
    <div
      {...rest}
      className={cn(
        'cursor-pointer rounded-xl p-2 transition-all hover:bg-zinc-800',
        { 'bg-zinc-800': isActive },
        className
      )}
    />
  );
}
