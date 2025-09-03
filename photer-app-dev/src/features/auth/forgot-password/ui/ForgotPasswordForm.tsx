'use client';
import Link from 'next/link';
import { ReactElement, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorMessage } from '@/app/(auth)/forgot-password/page';
import { Card } from '@/widgets/card/card';
import { Button, Input } from '@/shared/ui';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ForgotPasswordFormSchema,
  FormSchemaType,
} from '../types/forgotPasswordFormSchema';
import { useRecaptcha } from '../hooks/useRecaptcha';

type Props = {
  isLoading: boolean;
  onSubmit: SubmitHandler<FormSchemaType>;
  errorMessage: ErrorMessage;
  isFormSend: boolean;
};

export const ForgotPasswordForm = ({
  isLoading,
  onSubmit,
  errorMessage,
  isFormSend,
}: Props): ReactElement => {
  const { executeRecaptchaToken } = useRecaptcha();

  const {
    handleSubmit,
    setValue,
    setError,
    register,
    formState: { errors, isValid },
  } = useForm<FormSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(ForgotPasswordFormSchema),
  });

  const onFormSubmit: SubmitHandler<FormSchemaType> = async ({ email }) => {
    const token = await executeRecaptchaToken('recoveryPassword');
    setValue('recaptchaValue', token as string);
    await onSubmit({ email, recaptchaValue: token as string });
  };

  useEffect(() => {
    if (errorMessage.field === 'Captcha') {
      toast(errorMessage.message, { type: 'error' });
    }
    if (errorMessage.field === 'email') {
      setError('email', { message: errorMessage.message });
    }
    // setError(errorMessage.field as 'email' | 'recaptchaValue', {
    //   message: errorMessage.message,
    // });
  }, [errorMessage, setError]);

  return (
    <Card className={'max-w-sm p-6'}>
      <h1 className={'h1-text mb-9 text-center'}>Forgot Password</h1>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Input
          type={'email'}
          label={'Email'}
          placeholder={'Epam@epam.com'}
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <p className={'regular-text-14 text-light-900 mb-4'}>
          Enter your email address and we will send you further instructions
        </p>
        {isFormSend && (
          <p className={'regular-text-14 text-light-100 mb-4 pt-2'}>
            The link has been sent by email.
            <br /> If you don’t receive an email send link again
          </p>
        )}
        <Button
          className={'w-full'}
          type={'submit'}
          disabled={!isValid || isLoading}
        >
          {isFormSend ? 'Send Link Again' : 'Send Link'}
        </Button>
        <Button variant={'text'} className={'my-6 w-full'} asChild>
          <Link href={'/sign-in'}>Back to Sign In</Link>
        </Button>
      </form>
    </Card>
  );
};
