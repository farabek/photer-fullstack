import { cn } from '@/shared/lib/cn';
import { ReactNode } from 'react';

type Props = {
  children: string;
  onClick?: () => void;
  isActive?: boolean;
};
export const TabsButton = ({
  children,
  onClick,
  isActive,
}: Props): ReactNode => {
  return (
    <button
      className={cn(
        'size-base border-b-dark-100 text-dark-100 w-full cursor-pointer border-b-2 bg-transparent py-2 outline-none',
        isActive && 'text-accent-500 border-b-2 border-blue-500'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
