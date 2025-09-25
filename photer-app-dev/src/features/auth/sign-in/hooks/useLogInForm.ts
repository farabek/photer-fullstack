// src/features/auth/sign-in/hooks/useLogInForm.ts
'use client';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { useLoginMutation } from '../../api/authApi';
import { decodeJwt } from '@/shared/lib/decodeJwt';
import { LogInSchema, logInSchema } from './validationSchema';

export function useLogInForm(): {
  register: ReturnType<typeof useForm<LogInSchema>>['register'];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  setValue: ReturnType<typeof useForm<LogInSchema>>['setValue'];
  isDirty: boolean;
  hasLoginError: boolean;
  loginErrorMessage: string;
  formErrors: ReturnType<typeof useForm<LogInSchema>>['formState']['errors'];
  isLoading: boolean;
} {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false); // Состояние для отслеживания редиректа
  const [loginErrorMessage, setLoginErrorMessage] = useState(''); // Сообщение об ошибке входа

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty, errors },
  } = useForm<LogInSchema>({
    resolver: zodResolver(logInSchema),
    mode: 'onBlur',
  });
  const [loginQuery, { isLoading, isError }] = useLoginMutation();

  const onSubmit: SubmitHandler<LogInSchema> = async (
    data: LogInSchema
  ): Promise<void> => {
    try {
      const result = await loginQuery(data).unwrap();

      reset();
      const accessToken = result.accessToken;
      const payload = decodeJwt(accessToken);
      const userId = payload.userId || payload.sub;

      // Устанавливаем состояние редиректа перед переходом
      setIsRedirecting(true);

      // Небольшая задержка для показа состояния загрузки
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push(`/profile/${userId}`);
    } catch (err: any) {
      console.log('Login failed:', err);

      // Обрабатываем различные типы ошибок
      if (err?.data?.message) {
        setLoginErrorMessage(err.data.message);
      } else if (err?.status === 401) {
        setLoginErrorMessage(
          'Email not confirmed. Please check your email and confirm your account.'
        );
      } else if (err?.status === 400) {
        setLoginErrorMessage('Invalid email or password.');
      } else {
        setLoginErrorMessage('Login failed. Please try again.');
      }

      // Сбрасываем состояние редиректа в случае ошибки
      setIsRedirecting(false);
    }
  };

  // Возвращаем true, если идет либо запрос, либо редирект
  const isFormLoading = isLoading || isRedirecting;

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    isDirty,
    hasLoginError: isError,
    loginErrorMessage,
    formErrors: errors,
    isLoading: isFormLoading, // Используем комбинированное состояние
  };
}
