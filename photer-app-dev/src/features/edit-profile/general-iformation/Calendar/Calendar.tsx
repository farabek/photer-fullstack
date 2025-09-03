import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { ReactNode, useEffect, useState } from 'react';
import { Input } from '@/shared/ui';
import { CustomHeader } from './CustomHeader';
import './custom-datepicker.css';
import { cn } from '@/shared/lib/cn';

type Props = {
  className?: string;
  errorMessage?: string | undefined;
  selected: Date;
  onChange: (date: Date | null) => void;
};
export const Calendar = ({
  selected,
  className,
  errorMessage,
  onChange,
  ...rest
}: Props): ReactNode => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    if (selected) {
      setCurrentDate(new Date(selected));
    }
  }, [selected]);

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    event.preventDefault();
  };

  return (
    <DatePicker
      className={className}
      selected={selected}
      calendarClassName="!bg-dark-500 p-[10px] !border-1 !border-dark-300"
      wrapperClassName="w-full"
      showPopperArrow={false}
      popperPlacement="bottom-start"
      popperClassName="!top-[-30px] "
      calendarStartDay={1} // Устанавливаем начало недели на понедельник
      onKeyDown={handleKeyDown}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      {...rest}
      customInput={<Input errorMessage={errorMessage} type="date" />}
      renderCustomHeader={({ date, changeYear, changeMonth }) => {
        const handleYearChange = (year: number): void => {
          changeYear(year);
          const updateCurrentDate = new Date(currentDate);
          updateCurrentDate.setFullYear(year);
          setCurrentDate(updateCurrentDate);
        };
        const handleMonthChange = (month: number): void => {
          changeMonth(month);
          const updateCurrentDate = new Date(currentDate);
          updateCurrentDate.setMonth(month);
          setCurrentDate(updateCurrentDate);
        };
        return CustomHeader({ date, handleYearChange, handleMonthChange });
      }}
      dayClassName={(d) => {
        const date = new Date(d);
        const day = date.getDay();
        const isDayInCurrentMonth = date.getMonth() === currentDate.getMonth();
        const isDaySelected =
          date.toDateString() === currentDate.toDateString();
        const isWeekend = day === 0 || day === 6; // 0 - воскресенье, 6 - суббота
        const dayStyle = cn(
          'hover:!bg-accent-500 hover:!rounded-full  outline-none hover:text-accent-300',
          isDayInCurrentMonth && isWeekend && '!text-danger-300',
          isDayInCurrentMonth && !isWeekend && '!text-light-100',
          !isDayInCurrentMonth && '!text-light-900',
          isDaySelected && '!bg-accent-500 !rounded-none !text-light-100'
        );
        return dayStyle;
      }}
      weekDayClassName={() => '!text-light-900'}
    />
  );
};
