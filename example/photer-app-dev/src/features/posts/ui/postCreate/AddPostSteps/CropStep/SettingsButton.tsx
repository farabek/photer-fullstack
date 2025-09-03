import { Button, IconSprite } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { SpriteName } from 'public/icons/spriteNames';

type SettingsButtonProps = {
  iconName: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
};

export const SettingsButton = ({
  iconName,
  isActive,
  onClick,
  className = '',
}: SettingsButtonProps): React.ReactElement => (
  <Button
    variant="text"
    className={cn(
      'bg-dark-500 group w-0 border-0 focus:border-0 active:border-0',
      className
    )}
    onClick={onClick}
  >
    <IconSprite
      iconName={iconName as SpriteName}
      className={cn('fill-light-100 transition-colors duration-200', {
        'fill-accent-500': isActive,
      })}
    />
  </Button>
);
