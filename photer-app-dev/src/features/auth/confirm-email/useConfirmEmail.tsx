'use client';

import { useState } from 'react';
import { useConfirmEmailMutation } from '../api/authApi';

export function useConfirmEmail() {
  const [confirmEmail, { isLoading }] = useConfirmEmailMutation();
  const [error, setError] = useState<string>('');

  const handleConfirmEmail = async (code: string): Promise<boolean> => {
    try {
      setError('');
      console.log('🔍 Frontend: Attempting to confirm email with code:', code);
      console.log('🔍 Frontend: Code length:', code.length);
      console.log('🔍 Frontend: Code trimmed:', code.trim());

      await confirmEmail({ code }).unwrap();
      console.log('✅ Frontend: Email confirmation successful');
      return true;
    } catch (err: any) {
      console.error('❌ Frontend: Email confirmation error:', err);

      if (err?.data?.errorsMessages?.[0]?.message) {
        const message = err.data.errorsMessages[0].message;

        // Переводим сообщения об ошибках на более понятный язык
        switch (message) {
          case 'UUID not correct':
            setError(
              'Неверный код подтверждения. Проверьте правильность введенного кода.'
            );
            break;
          case 'Email already confirmed':
            setError('Email уже подтвержден. Вы можете войти в систему.');
            break;
          case 'Confirmation code expired':
            setError('Код подтверждения истек. Запросите новый код.');
            break;
          default:
            setError(message);
        }
      } else if (err?.status === 400) {
        setError(
          'Неверный код подтверждения. Убедитесь, что код введен правильно.'
        );
      } else {
        setError('Не удалось подтвердить email. Попробуйте еще раз.');
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
