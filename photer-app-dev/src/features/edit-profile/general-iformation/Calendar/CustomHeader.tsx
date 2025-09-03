import 'react-datepicker/dist/react-datepicker.css';
import { getYear } from 'date-fns/getYear';
import { getMonth } from 'date-fns/getMonth';
import { SelectBox } from '@/widgets/SelectBox/SelectBox';
import { SelectItem } from '@/widgets/SelectBox/SelectItem';
import { ReactElement } from 'react';

function range(start: number, end: number): number[] {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

type Props = {
  date: Date;
  handleYearChange: (year: number) => void;
  handleMonthChange: (month: number) => void;
};

export const CustomHeader = ({
  date,
  handleYearChange,
  handleMonthChange,
}: Props): ReactElement => {
  const CurrentYear = new Date().getFullYear();
  const years = range(CurrentYear - 100, CurrentYear + 1);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className="text-light-900 flex justify-center gap-5">
      <SelectBox
        className="h-[25px] w-[90px]"
        contentClassName="w-[90px] max-h-[250px]"
        iconSize={20}
        value={getYear(date).toString()}
        onValueChange={(value) => handleYearChange(Number(value))}
      >
        {years.reverse().map((option) => (
          <SelectItem
            className="py-[5px]"
            key={option}
            value={option.toString()}
          >
            {option}
          </SelectItem>
        ))}
      </SelectBox>
      <SelectBox
        className="h-[25px] w-[120px]"
        contentClassName="w-[120px] max-h-[250px]"
        iconSize={20}
        value={months[getMonth(date)]}
        onValueChange={(value) => handleMonthChange(months.indexOf(value))}
      >
        {months.map((option) => (
          <SelectItem key={option} value={option.toString()}>
            {option}
          </SelectItem>
        ))}
      </SelectBox>
    </div>
  );
};
