'use client';

import { Flip, ToastContainer, ToastContainerProps } from 'react-toastify';
import { IconSprite } from '@/shared/ui';
import { ReactElement } from 'react';

export const Alert = (props: ToastContainerProps): ReactElement => {
  return (
    <ToastContainer
      closeButton={() => <IconSprite iconName="close" />}
      closeOnClick={true}
      hideProgressBar
      position={'top-center'}
      transition={Flip}
      icon={false}
      {...props}
    />
  );
};
