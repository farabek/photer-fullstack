'use client';

import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  ReactElement,
  useId,
  useLayoutEffect,
  useRef,
} from 'react';
import { cn } from '@/shared/lib/cn';

type Props = {
  id?: string;
  label?: string;
  errorMessage?: string;
  onValueChange?: (text: string) => void;
} & ComponentPropsWithoutRef<'textarea'>;

export const Textarea = ({
  id,
  label,
  errorMessage,
  onValueChange,
  onChange,
  className,
  ...props
}: Props): ReactElement => {
  const uniqueId = useId();
  id ??= uniqueId;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (): void => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useLayoutEffect(adjustHeight, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    onChange?.(e);
    onValueChange?.(e.currentTarget.value);
    adjustHeight();
  };

  return (
    <div className={className}>
      {label && (
        <label
          className="text-light-900 regular-text-14 disabled:text-dark-100"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={textareaRef}
        onChange={handleChange}
        className={cn(
          'border-dark-100 regular-text-16 text-light-900 bg-dark-500 focus:text-light-100 active:text-light-100 disabled:text-dark-100 focus:border-accent-700 active:border-light-100 min-h-[84px] w-full resize-none overflow-hidden rounded-[2px] border border-solid px-3 py-1.5 disabled:cursor-not-allowed',
          errorMessage && 'text-light-100 border-danger-500'
        )}
        {...props}
      />
      {errorMessage && (
        <span className="regular-text-14 text-danger-500">{errorMessage}</span>
      )}
    </div>
  );
};
