import { Button, IconSprite } from '@/shared/ui';
import React from 'react';

export function AddPostModalHeader({
  onBack,
  onNext,
  disabled,
  title,
  text = 'Next',
}: {
  onBack: () => void;
  onNext: () => void;
  disabled: boolean;
  title: string;
  text?: string;
}): React.ReactElement {
  return (
    <div className="flex w-full items-center justify-between">
      <Button variant="text" className="w-0 cursor-pointer" onClick={onBack}>
        <IconSprite iconName="arrow-ios-back" width={24} height={24} />
      </Button>
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button
        variant="text"
        className="text-accent-500"
        onClick={onNext}
        disabled={disabled}
      >
        {text}
      </Button>
    </div>
  );
}
