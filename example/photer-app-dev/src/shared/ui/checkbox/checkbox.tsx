'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '@/shared/lib/cn';
import { IconSprite } from '../icon/IconSprite';

/**
 * Компонент Checkbox, основанный на Radix UI.
 * @see https://www.radix-ui.com/docs/primitives/components/checkbox
 *
 * @param {boolean} checked - Управляет состоянием чекбокса (выбран/не выбран).
 * @param {function} onCheckedChange - Callback, вызываемый при изменении состояния чекбокса. Принимает новое значение `checked`.
 */
type Props = {
  label?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  onCheckedChange?: (checked: boolean) => void;
};
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & Props
>(
  (
    { label, disabled, onCheckedChange, id, className, ...props },
    ref
  ): React.ReactElement => {
    const uniqueId = React.useId();
    id ??= uniqueId;

    return (
      <div className={cn('flex items-center gap-[11px]')}>
        <CheckboxPrimitive.Root
          ref={ref}
          id={id}
          disabled={disabled}
          aria-label={label ? undefined : 'Checkbox'}
          aria-disabled={disabled}
          onCheckedChange={onCheckedChange}
          className={cn(
            'group peer border-light-100 relative h-5 w-5 cursor-pointer rounded-sm border-2',
            'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
            className
          )}
          {...props}
        >
          <span
            className={cn(
              'absolute inset-0 top-1/2 left-1/2 h-9 w-9 translate-x-[-50%] translate-y-[-50%] rounded-full border border-transparent',
              'group-active:border-dark-100 group-active:bg-dark-100',
              'group-focus:border-dark-500 group-focus:bg-dark-500',
              'group-disabled:border-none group-disabled:bg-transparent',
              'group-hover:border-dark-300 group-hover:bg-dark-300',
              'z-[-1] transition-all duration-200'
            )}
          ></span>
          <CheckboxPrimitive.Indicator
            className={cn('flex items-center justify-center text-current')}
          >
            <IconSprite
              iconName="checkmark-outline"
              className="bg-light-100 absolute h-[18px] w-[18px] rounded-[1px]"
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && (
          <label
            className={cn(
              'regular-text-14 text-light-100',
              disabled && 'text-light-900 cursor-not-allowed'
            )}
            htmlFor={id}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
