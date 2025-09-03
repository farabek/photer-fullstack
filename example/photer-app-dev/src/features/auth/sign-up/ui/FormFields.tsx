import { Input } from '@/shared/ui';
import React from 'react';
import { CheckboxField } from './CheckboxField';
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { SignUpFormData } from '../hooks/validationSchema';
type FormFieldsProps = {
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  control: Control<SignUpFormData>;
};
export function FormFields({
  errors,
  register,
  control,
}: FormFieldsProps): React.ReactElement {
  return (
    <>
      <Input
        className="w-[330px]"
        label="Username"
        errorMessage={errors.username?.message}
        {...register('username')}
        autoComplete="username"
      />
      <Input
        className="w-[330px]"
        type="email"
        label="Email"
        errorMessage={errors.email?.message}
        {...register('email')}
      />
      <Input
        className="w-[330px]"
        type="password"
        label="Password"
        errorMessage={errors.password?.message}
        {...register('password')}
        autoComplete="new-password"
      />
      <Input
        className="w-[330px]"
        type="password"
        label="Password confirmation"
        errorMessage={errors.confirmPassword?.message}
        {...register('confirmPassword')}
        autoComplete="new-password"
      />
      <CheckboxField control={control} />
    </>
  );
}
