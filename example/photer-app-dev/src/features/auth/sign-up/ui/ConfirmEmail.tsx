'use client';

import { ReactElement } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui';

export const ConfirmEmail = (): ReactElement => {
  return (
    <div className="text-light-100 m-auto mt-[35px] flex flex-col items-center">
      <h1 className="h1-text"> Congratulations! </h1>
      <p className="regular-text-16 mt-[19px]">Your email has been confirmed</p>
      <Button className="mt-[54px] w-[182px]">Sign In</Button>
      <Image
        src="/images/confirmed.png"
        alt="Email confirmed"
        width={432}
        height={300}
        className="mt-18"
      />
    </div>
  );
};
