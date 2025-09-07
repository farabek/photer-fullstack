import { Button, IconSprite } from '@/shared/ui';
import React, { ReactElement } from 'react';

type Props = {
  openModal: () => void;
  hideText?: boolean;
};

const LogoutButton = React.memo(function LogoutButton({
  openModal,
  hideText = false,
}: Props): ReactElement {
  return (
    <Button
      onClick={openModal}
      variant="text"
      className="text-light-100 hover:text-light-100 active:text-light-100 focus:text-light-100 cursor-pointer border-none"
    >
      <div className="flex items-center gap-3">
        <IconSprite iconName="log-out" />
        {!hideText && <span className="regular-text-14">Log Out</span>}
      </div>
    </Button>
  );
});

LogoutButton.displayName = 'LogoutButton';

export { LogoutButton };
