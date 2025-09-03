import { cn } from '@/shared/lib/cn';
import Image from 'next/image';
import { ReactNode } from 'react';

type Props = {
  src: string;
  className?: string;
};

export const CircleAvatar = ({ src, className }: Props): ReactNode => {
  return (
    <div
      className={cn(
        'flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded-full object-cover',
        className
      )}
    >
      <Image
        src={src}
        alt={'icon'}
        width={36}
        height={36}
        className="h-full w-full object-cover"
        priority
        unoptimized
      />
    </div>
  );
};
