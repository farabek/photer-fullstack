// src/features/auth/sign-in/ui/LogIn.tsx

'use client';

import { useLogInForm } from '@/features/auth/sign-in/hooks/useLogInForm';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button/Button';
import { Input } from '@/shared/ui/input/Input';
import { OAuthLinks } from '@/shared/ui/oauth/OAuthLinks';
import { Spinner } from '@/shared/ui';
import { Card } from '@/widgets/card/card';
import Link from 'next/link';
import { ReactElement } from 'react';

export default function LogIn(): ReactElement {
  const {
    register,
    handleSubmit,
    isDirty,
    hasLoginError,
    formErrors,
    isLoading,
  } = useLogInForm();

  return (
    <Card
      className={cn(
        'align-center mt-[24px] flex w-full max-w-[378px] flex-col justify-center p-[24px]',
        'max-sm:bg-dark-900 max-sm:border-hidden'
      )}
    >
      <h1 className="h1-text text-center">Sign In</h1>
      <OAuthLinks />
      <div className="mt-6 flex w-full flex-col justify-center align-middle">
        <form onSubmit={handleSubmit} className={'flex flex-col items-end'}>
          {hasLoginError && (
            <p className={'text-danger-500 text-center'}>
              The email or password are incorrect. Try again please
            </p>
          )}
          <Input
            className="w-full"
            label={'Email'}
            errorMessage={formErrors.email?.message}
            {...register('email')}
          />
          <Input
            type="password"
            className="w-full"
            label={'Password'}
            errorMessage={formErrors.password?.message}
            {...register('password')}
          />
          <Link href="/forgot-password" className={'text-light-900'}>
            Forgot Password
          </Link>
          {/* Кнопка входа с состоянием загрузки и редиректа */}
          <Button
            className="my-5 w-full"
            type="submit"
            disabled={
              !isDirty ||
              isLoading ||
              !!formErrors.email?.message ||
              !!formErrors.password?.message
            }
          >
            {isLoading ? (
              // Состояние загрузки: спиннер + сообщение (показывается до перехода на профиль)
              <div className="flex items-center justify-center gap-2">
                <Spinner size={16} />
                <span>Вход в систему...</span>
              </div>
            ) : (
              // Обычное состояние: текст кнопки
              'Sign In'
            )}
          </Button>
        </form>
        <p className="regular-text-16 text-center">Don’t have an account? </p>
        <Link
          href="/sign-up"
          className="text-primary-500 text-accent-500 mx-auto w-20 p-2 font-semibold"
        >
          Sign Up
        </Link>
      </div>
    </Card>
  );
}
