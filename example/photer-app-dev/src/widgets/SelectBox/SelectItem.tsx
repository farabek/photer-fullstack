'use client';

import { ReactElement } from 'react';
import * as Select from '@radix-ui/react-select';
import { SelectItemProps } from '@radix-ui/react-select';
import Image, { StaticImageData } from 'next/image';
import { cn } from '@/shared/lib/cn';
import { SpriteName } from 'public/icons/spriteNames';
import { IconSprite } from '@/shared/ui';

type Props = SelectItemProps & {
  icon?: SpriteName | StaticImageData | string;
};

export function SelectItem({
  children,
  className,
  icon,
  ...props
}: Props): ReactElement {
  const isSpriteIcon = typeof icon === 'string' && /^[a-z0-9\-]+$/i.test(icon);

  return (
    <Select.Item
      className={cn(
        'regular-text-16 text-light-100 flex h-[36px] items-center px-[12px]',
        'focus:outline-0',
        'hover:text-accent-500 hover:bg-dark-300',
        className
      )}
      {...props}
    >
      <Select.ItemText asChild>
        <div className="flex flex-row items-center gap-[12px]">
          {icon && (
            <>
              {isSpriteIcon ? (
                <IconSprite
                  iconName={icon as SpriteName}
                  width={20}
                  height={20}
                />
              ) : (
                <div className="relative h-[20px] w-[20px] shrink-0">
                  <Image
                    src={icon}
                    alt="icon"
                    fill
                    className="object-contain"
                    sizes="20px"
                  />
                </div>
              )}
            </>
          )}
          {children}
        </div>
      </Select.ItemText>
    </Select.Item>
  );
}
