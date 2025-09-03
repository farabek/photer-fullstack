'use client';
import expiredImage from 'public/images/expired.png';
import Image from 'next/image';
import { ReactElement } from 'react';
import { Button } from '@/shared/ui';
import { useRecoveryPasswordResendingMutation } from '@/features/auth/api/authApi';
import { ErrorMessage } from '@/app/(auth)/forgot-password/page';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/shared/state/store';
import { openModal } from '@/shared/state/slices/modalSlice';

export default function ResendLink(): ReactElement {
  const [resendLink, { isLoading }] = useRecoveryPasswordResendingMutation();
  const dispatch = useAppDispatch();

  const handleResendLink = async (): Promise<void> => {
    try {
      await resendLink({
        email: localStorage.getItem('email') as string,
      }).unwrap();
      dispatch(
        openModal({
          type: 'auth',
          props: {
            email: localStorage.getItem('email'),
          },
        })
      );
      localStorage.removeItem('email');
    } catch (e) {
      const error = e as { data: { errorsMessages: ErrorMessage[] } };
      if (Array.isArray(error.data.errorsMessages)) {
        toast(error.data.errorsMessages[0].message, { type: 'error' });
      }
      console.log(e);
    }
  };

  return (
    <>
      <div className={'max-w-74 text-center'}>
        <h1 className={'h1-text'}>Email verification link expired</h1>
        <p className={'regular-text-16 mb mt-5 mb-7'}>
          Looks like the verification link has expired. Not to worry, we can
          send the link again
        </p>
        <Button
          className={'w-full'}
          onClick={handleResendLink}
          disabled={isLoading}
        >
          Resend link
        </Button>
      </div>
      <Image src={expiredImage} alt={'time'} width={470} />
    </>
  );
}
