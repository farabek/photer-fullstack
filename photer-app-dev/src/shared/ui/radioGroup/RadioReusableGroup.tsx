'use client';

import { ComponentPropsWithRef, FormEvent, ReactElement } from 'react';
import { cn } from '@/shared/lib/cn';
import * as RadioGroup from '@radix-ui/react-radio-group';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  options: Option[];
  orientation?: 'horizontal' | 'vertical';
  defaultValue?: Option['value'];
  onValueChange?: (value: string | FormEvent<HTMLDivElement>) => void;
} & ComponentPropsWithRef<typeof RadioGroup.Root>;

export const RadioReusableGroup = ({
  options,
  onValueChange,
  orientation,
  defaultValue,
  ref,
  ...rest
}: Props): ReactElement => {
  return (
    <RadioGroup.Root
      className={cn(
        'flex gap-[44px]',
        `${orientation === 'vertical' && 'flex-col gap-[24px]'}`
      )}
      aria-label="Radio group"
      onValueChange={onValueChange}
      ref={ref}
      defaultValue={defaultValue}
      loop={true}
      orientation={orientation}
      {...rest}
    >
      {options.map((option, index) => (
        <div key={index} className={'flex items-center'}>
          <RadioGroup.Item
            className={cn(
              'hover:bg-dark-100 border-light-100 hover:shadow-dark-100 disabled:border-dark-100 ' +
                'size-[20px] cursor-default rounded-full border-2 hover:shadow-[0_0_0_8px]' +
                ' focus:shadow-dark-500 focus:bg-dark-500 outline-none focus:shadow-[0_0_0_8px]' +
                ' active:shadow-dark-100 active:bg-dark-100 active:shadow-[0_0_0_8px]' +
                ' disabled:hover:bg-transparent disabled:hover:shadow-none'
            )}
            value={option.value}
            disabled={option.disabled}
            id={option.value}
          >
            <RadioGroup.Indicator
              className={cn(
                'after:bg-light-100 relative flex size-full items-center ' +
                  'justify-center after:block after:size-[10px] after:rounded-full',
                { 'after:bg-dark-100': option.disabled }
              )}
            />
          </RadioGroup.Item>
          <label
            className={cn(
              'regular-text-14 text-light-100 pl-[8px] leading-none',
              {
                'text-dark-100': option.disabled,
              }
            )}
            htmlFor={option.value}
          >
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup.Root>
  );
};
