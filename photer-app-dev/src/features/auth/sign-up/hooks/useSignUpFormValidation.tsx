import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpFormData, signUpSchema } from './validationSchema';
import { UseSignUpFormValidationReturn } from '../types/useSignUpFormReturn';

export function useSignUpFormValidation(): UseSignUpFormValidationReturn {
  const {
    reset,
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  return {
    reset,
    register,
    handleSubmit,
    control,
    setError,
    isValid,
    errors,
  };
}
