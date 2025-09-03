'use client';

import { ReactElement } from 'react';
import * as Select from '@radix-ui/react-select';
import { SelectProps } from '@radix-ui/react-select';
import { cn } from '@/shared/lib/cn';
import { validateChildrenValues } from '@/shared/lib/validate-children-values';
import { IconSprite } from '@/shared/ui/icon/IconSprite';

type Props = SelectProps & {
  title?: string;
  className?: string;
  contentClassName?: string;
  placeholder?: string;
  showValue?: boolean;
  iconSize?: number;
};

export function SelectBox({
  title,
  placeholder,
  className,
  contentClassName,
  children,
  showValue = true,
  iconSize,
  ...props
}: Props): ReactElement {
  validateChildrenValues(children);

  function onCloseHandler(e: Event): undefined {
    e.preventDefault();
  }

  return (
    <div className={'flex flex-col'}>
      {title && (
        <span className={'regular-text-14 text-light-900'}>{title}</span>
      )}
      <Select.Root {...props}>
        <Select.Trigger
          className={cn(
            'border-dark-100 group bg-dark-700 text-light-100 regular-text-16 flex h-[36px] w-[210px] cursor-pointer items-center justify-between rounded-[2px] border px-[12px]',
            'focus:outline-accent-500 focus:outline-[2px]',
            'hover:text-light-900',
            'disabled:text-dark-100',
            'data-[state=open]:border-light-100 data-[state=open]:bg-dark-500 data-[state=open]:rounded-b-none',
            className
          )}
        >
          {showValue && <Select.Value placeholder={placeholder} />}
          <Select.Icon>
            <IconSprite
              iconName="arrow-ios-Down-outline"
              className={cn(
                'fill-light-100 duration-500 ease-in-out group-data-[state=open]:-rotate-180'
              )}
              width={iconSize ? iconSize : 24}
              height={iconSize ? iconSize : 24}
            />
          </Select.Icon>
        </Select.Trigger>

        <Select.Content
          className={cn(
            'bg-dark-500 border-light-100 w-[210px] cursor-pointer rounded-b-[2px] border',
            'border-t-0',
            contentClassName
          )}
          position={'popper'}
          onCloseAutoFocus={onCloseHandler}
        >
          <Select.Viewport>{children}</Select.Viewport>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
