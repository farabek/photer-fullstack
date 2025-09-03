'use client';

import { cn } from '@/shared/lib/cn';
import { Button, IconSprite } from '@/shared/ui';
import { Card } from '@/widgets/card/card';
import { SpriteName } from 'public/icons/spriteNames';

type SettingControlProps = {
  iconName: string;
  isActive: boolean;
  onToggleAction: () => void;
  children?: React.ReactNode;
  cardClassName?: string;
};

export function SettingControl({
  iconName,
  isActive,
  onToggleAction,
  children,
  cardClassName = '',
}: SettingControlProps): React.ReactElement {
  return (
    <div className="relative">
      <Button
        variant="text"
        className={cn(
          'bg-dark-500 group w-0 border-0 focus:border-0 active:border-0'
        )}
        onClick={onToggleAction}
      >
        <IconSprite
          iconName={iconName as SpriteName}
          className={cn('fill-light-100 transition-colors duration-200', {
            'fill-accent-500': isActive,
          })}
        />
      </Button>

      {isActive && (
        <Card
          className={cn(
            'bg-dark-500/80 absolute bottom-10 left-1/2 flex min-h-9 w-auto translate-x-[-50%] justify-center rounded-xs border-none px-3',
            cardClassName
          )}
        >
          {children}
        </Card>
      )}
    </div>
  );
}
