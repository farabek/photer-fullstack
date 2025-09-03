import { useSignUpFormValidation } from './useSignUpFormValidation';
import { useRegistration } from './useRegistration';
import type { SignUpFormData } from './validationSchema';
import { UseSignUpFormReturn } from '../types/useSignUpFormReturn';

import { useEffect } from 'react';

type ErrorWithData = {
  data?: {
    errorsMessages?: { field: string; message: string }[];
  };
};

export function useSignUpForm(): Omit<
  UseSignUpFormReturn,
  'error' | 'setError' | 'reset'
> {
  const { register, handleSubmit, control, errors, isValid, setError, reset } =
    useSignUpFormValidation();

  const {
    registerNewUser,
    isLoading,
    isSuccess,
    setIsSuccess,
    userData,
    error,
  } = useRegistration();

  useEffect(() => {
    if (error) {
      const typedError = error as ErrorWithData;
      if (typedError?.data?.errorsMessages) {
        typedError.data.errorsMessages.forEach((err) => {
          const field = err.field === 'login' ? 'username' : err.field;
          setError(field as keyof SignUpFormData, {
            type: 'server',
            message: err.message,
          });
        });
      }
    }
  }, [error, setError]);

  const onSubmit = async (data: SignUpFormData): Promise<void> => {
    await registerNewUser(data, reset);
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    isValid,
    onSubmit,
    userData,
    isSuccess,
    setIsSuccess,
    isLoading,
  };
}
