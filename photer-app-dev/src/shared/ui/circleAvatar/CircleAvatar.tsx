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
        'relative flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded-full object-cover',
        className
      )}
    >
      <Image
        src={src}
        alt={'icon'}
        fill
        sizes="36px"
        className="object-cover"
        priority
        unoptimized
      />
    </div>
  );
};
