import { Button, IconSprite } from '@/shared/ui';

type PhotoNavigationProps = {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function PhotoNavigation({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: PhotoNavigationProps): React.ReactElement {
  return (
    <div>
      {hasPrev && (
        <Button
          type="button"
          variant="text"
          className="bg-dark-500/55 absolute top-[50%] left-0 p-3"
          onClick={onPrev}
        >
          <IconSprite iconName="arrow-ios-back" width={24} height={24} />
        </Button>
      )}
      {hasNext && (
        <Button
          type="button"
          variant="text"
          className="bg-dark-500/55 absolute top-[50%] right-0 p-3"
          onClick={onNext}
        >
          <IconSprite iconName="arrow-ios-forward" width={24} height={24} />
        </Button>
      )}
    </div>
  );
}
