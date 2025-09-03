import { cn } from '@/shared/lib/cn';
import { Input, Scrollbar } from '@/shared/ui';
import React, { ReactNode, useState } from 'react';
type Option = {
  value: string;
  ui: React.ReactNode;
};
type Props = {
  options: Option[];
  placeholder?: string;
  className?: string;
  onClick?: (value: string) => void;
  inputValue: string;
  setInputValue?: (value: string) => void;
};
export const AutocompleteDropdown = ({
  options,
  placeholder,
  className,
  onClick,
  inputValue,
  setInputValue,
  ...rest
}: Props): ReactNode => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setInputValue?.(value);
    if (value) {
      const filtered = options.filter((option) =>
        option.value.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  };
  const handleOptionClick = (option: Option): void => {
    setInputValue?.(option.value);
    setFilteredOptions(options);
    setIsFocused(false);
    onClick?.(option.value);
  };
  const handleFocus = (): void => {
    setIsFocused(true);
    setFilteredOptions(options);
  };
  const handleBlur = (): void => {
    // Задержкa, чтобы избежать закрытия меню при клике на элемент
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };
  return (
    <div className={cn('relative', className)}>
      <Input
        type="text"
        value={inputValue}
        {...rest}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder || ''}
      />
      {isFocused && filteredOptions.length > 0 && (
        <ul
          className={
            'border-light-100 bg-dark-500 absolute top-[45px] max-h-[200px] w-full rounded-[2px] border-1'
          }
        >
          <Scrollbar maxHeight={200}>
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="hover:bg-dark-300 hover:text-accent-500 cursor-pointer p-1 pr-2"
                onClick={() => handleOptionClick(option)}
              >
                {option.ui}
              </li>
            ))}
          </Scrollbar>
        </ul>
      )}
    </div>
  );
};
