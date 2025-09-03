'use client';

import { cn } from '@/shared/lib/cn';
import { Slot } from '@radix-ui/react-slot';
import { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import Image, { StaticImageData } from 'next/image';

type Props = {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  asChild?: boolean;
  icon?: StaticImageData | string | ReactNode;
} & ComponentPropsWithoutRef<'button'>;

function isImageSource(
  icon: StaticImageData | string | ReactNode
): icon is string | StaticImageData {
  return (
    typeof icon === 'string' ||
    ((icon && 'src' in (icon as StaticImageData)) as boolean)
  );
}

const buttonVariants = {
  primary:
    'bg-accent-500 active:bg-accent-700 hover:bg-accent-100 disabled:bg-accent-900 focus:border-accent-700 active:text-light-500 disabled:text-light-900',
  secondary:
    'bg-dark-300 hover:bg-dark-100 disabled:bg-dark-500 focus:border-accent-300 disabled:text-light-900 active:bg-[#212121]',
  outlined:
    'text-accent-500 hover:text-accent-100 disabled:text-accent-900 focus:text-accent-700 active:text-accent-700 border-accent-500 hover:border-accent-100 disabled:border-accent-900 focus:border-accent-700 active:border-accent-700 border-[1px]',
  text: 'text-accent-500 hover:text-accent-100 disabled:text-accent-900 focus:text-accent-500 active:text-accent-700 focus:border-accent-700',
};

export function Button({
  variant = 'primary',
  className,
  asChild,
  children,
  icon,
  ...rest
}: Props): ReactElement {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      className={cn(
        'h3-text text-light-100 inline-flex h-[36px] items-center justify-center rounded-sm border-2 border-transparent px-6 py-1.5 text-center focus:border-2',
        buttonVariants[variant],
        className,
        icon && 'px-3'
      )}
      {...rest}
    >
      <span className="flex items-center">
        {icon && (
          <span className={cn(children && 'mr-2')}>
            {isImageSource(icon) ? (
              <Image
                src={icon}
                alt="button icon"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            ) : (
              icon
            )}
          </span>
        )}
        {children}
      </span>
    </Component>
  );
}
