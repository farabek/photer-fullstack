// src/features/auth/sign-up/ui/SignUpForm.tsx
'use client';

import { FormFields } from './FormFields';
import { SubmitButton } from './SubmitButton';
import { Card } from '@/widgets/card/card';
import { useSignUpForm } from '../hooks/useSignUpForm';
import { SignUpPrompt } from './SignUpPrompt';
import { OAuthLinks } from '@/shared/ui/oauth/OAuthLinks';

export default function SignUpForm(): React.ReactElement {
  const formState = useSignUpForm();
  const onFormSubmit = formState.handleSubmit(formState.onSubmit);

  return (
    <Card className="m-0-auto mt-6 flex min-h-162 w-[378px] flex-col items-center justify-center">
      <h1 className="h1-text mt-[23px]">Sign Up</h1>
      <OAuthLinks />
      <form onSubmit={onFormSubmit} className="mt-6 w-full px-6">
        <FormFields
          register={formState.register}
          errors={formState.errors}
          control={formState.control}
        />
        <SubmitButton isValid={formState.isValid} text={'Sign Up'} />
        <SignUpPrompt
          promptText={'Do you have an account?'}
          buttonText={'Sign In'}
          href={'/sign-in'}
        />
      </form>
    </Card>
  );
}
