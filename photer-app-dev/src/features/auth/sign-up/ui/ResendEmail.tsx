'use client';

import React, { ReactElement, useState } from 'react';
import Image from 'next/image';
import { Button, Input } from '@/shared/ui';

export const ResendEmail = (): ReactElement => {
  const [email, setEmail] = useState('');

  const handleClick = (): void => {
    console.log(`Email: ${email}`);
  };

  return (
    <div className="text-light-100 m-auto mt-[35px] flex flex-col items-center">
      <h1 className="h1-text"> Email verification link expired </h1>
      <p className="regular-text-16 mt-[19px] mb-7 max-w-74 text-center">
        Looks like the verification link has expired. Not to worry, we can send
        the link again
      </p>
      <div>
        <Input
          className="w-[229px]"
          type="email"
          label="Email"
          onChangeValue={(value) => setEmail(value)}
        />
        <Button className="w-[229px] px-2" onClick={handleClick}>
          Resend verification link
        </Button>
      </div>
      <Image
        src="/images/expired.png"
        alt="Email confirmed"
        width={473}
        height={452}
        className="mt-9"
      />
    </div>
  );
};
