import { Button } from '@/shared/ui';
import React from 'react';

export function SubmitButton({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}): React.ReactElement {
  return (
    <Button className={'my-5 w-full'} disabled={!isValid} type="submit">
      {text}
    </Button>
  );
}
