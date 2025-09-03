'use client';
import { cn } from '@/shared/lib/cn';
import {
  ChangeEvent,
  ComponentProps,
  KeyboardEvent,
  ReactElement,
  useId,
  useState,
} from 'react';
import { IconSprite } from '@/shared/ui';

type Props = ComponentProps<'input'> & {
  type?: 'text' | 'email' | 'password' | 'search' | 'file' | 'date';
  label?: string;
  errorMessage?: string;
  className?: string;
  onSearchClick?: () => void;
  onChangeValue?: (value: string) => void;
  onEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleOnBlur?: () => void;
  handleOnFocus?: () => void;
  required?: boolean;
  children?: React.ReactNode;
  readOnly?: boolean;
};

export const Input = ({
  type = 'text',
  label,
  errorMessage,
  required = false,
  className = '',
  onSearchClick,
  disabled = false,
  placeholder,
  onChange,
  onChangeValue,
  onEnter,
  handleOnBlur,
  handleOnFocus,
  onKeyDown,
  children,
  readOnly,
  ...rest
}: Props): ReactElement => {
  const inputId = useId();

  const [isHidden, setIsHidden] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  let inputType = type;
  if ((type === 'password' && !isHidden) || type === 'date') {
    inputType = 'text';
  }

  let fillIcon = isFocused ? 'fill-light-100' : 'fill-light-900';
  if (disabled) {
    fillIcon = 'fill-dark-100';
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(e);
    onChangeValue?.(e.currentTarget.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === 'Enter') {
      onEnter?.(e);
    }
    onKeyDown?.(e);
  };

  return (
    <div
      className={cn(
        'relative flex flex-col',
        className,
        !errorMessage && 'pb-6'
      )}
    >
      {label && type !== 'search' && (
        <label
          htmlFor={inputId}
          className={cn(
            'regular-text-14 text-light-900 flex text-sm leading-6',
            disabled && 'text-dark-100'
          )}
        >
          {label}
          {required ? <span className="text-danger-500">*</span> : ''}
        </label>
      )}
      {type === 'search' && (
        <button
          onClick={onSearchClick}
          disabled={disabled}
          className="absolute top-[9px] left-2 border-none focus-visible:outline-none"
        >
          <IconSprite
            iconName="search"
            className={fillIcon}
            width="20"
            height="20"
          />
        </button>
      )}
      <input
        id={inputId}
        type={inputType}
        className={cn(
          'placeholder:text-light-900 disabled:placeholder:text-dark-100 text-light-900',
          'active:text-light-100 active:border-light-100 hover:border-light-900 hover:text-light-900',
          'disabled:border-dark-100 disabled:text-dark-100 focus:text-light-100',
          'focus:border-accent-500 focus-visible:border-accent-500 border-dark-100',
          'mounded-[2px] h-[36px] border-1 px-3 py-1.5 text-base focus-visible:outline-none',
          errorMessage && 'border-danger-500',
          type === 'password' && 'pr-10',
          type === 'search' && 'pr-2 pl-10'
        )}
        onBlur={() => {
          setIsFocused(false);
          handleOnBlur?.();
        }}
        onFocus={() => {
          setIsFocused(true);
          handleOnFocus?.();
        }}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        placeholder={isFocused ? '' : placeholder}
        disabled={disabled}
        {...rest}
        readOnly={readOnly}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setIsHidden(!isHidden)}
          className="absolute top-[30px] right-2 border-none focus-visible:outline-none"
          // disabled={disabled}
        >
          <IconSprite
            iconName={isHidden ? 'eye-off-outline' : 'eye-outline'}
            className={fillIcon}
          />
        </button>
      )}
      {type === 'date' && (
        <IconSprite
          iconName={'calendar'}
          className={'fill-light-100 absolute top-[5px] right-2'}
        />
      )}
      {children}
      {errorMessage && (
        <p className={'text-danger-500 text-regular text-sm leading-6'}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};
