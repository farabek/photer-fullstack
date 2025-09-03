'use client';

import { useState } from 'react';
import { useConfirmEmailMutation } from '../api/authApi';

export function useConfirmEmail() {
  const [confirmEmail, { isLoading }] = useConfirmEmailMutation();
  const [error, setError] = useState<string>('');

  const handleConfirmEmail = async (code: string): Promise<boolean> => {
    try {
      setError('');
      await confirmEmail({ code }).unwrap();
      return true;
    } catch (err: any) {
      if (err?.data?.errorsMessages?.[0]?.message) {
        setError(err.data.errorsMessages[0].message);
      } else {
        setError('Failed to confirm email. Please try again.');
      }
      return false;
    }
  };

  return {
    confirmEmail: handleConfirmEmail,
    isLoading,
    error,
  };
}
