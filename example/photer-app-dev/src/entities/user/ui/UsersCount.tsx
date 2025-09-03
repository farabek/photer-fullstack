import { Card } from '@/widgets/card/card';
import { cn } from '@/shared/lib/cn';
import { ReactElement } from 'react';

type Props = {
  usersCount: number;
};

export const UsersCount = ({ usersCount }: Props): ReactElement => {
  return (
    <Card className="mt-6 flex min-h-fit w-full max-w-244 flex-col items-center gap-4 px-6 py-3 lg:flex-row lg:justify-between">
      <h2 className={'h2-text inline'}>Registered users:</h2>
      <Card
        className={
          'h2-text b bg-dark-700 inline-flex min-h-12 min-w-51 justify-around p-3 text-center'
        }
      >
        {usersCount
          .toString()
          .padStart(6, '0')
          .split('')
          .map((el, index) => (
            <div key={index} className={cn('px-2', index > 0 && 'border-l-1')}>
              {el}
            </div>
          ))}
      </Card>
    </Card>
  );
};
