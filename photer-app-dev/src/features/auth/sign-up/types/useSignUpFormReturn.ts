import { useForm } from 'react-hook-form';
import { SignUpFormData } from '../hooks/validationSchema';
import { ApiError } from './apiError.types';

export type UseSignUpFormValidationReturn = {
  register: ReturnType<typeof useForm<SignUpFormData>>['register'];
  handleSubmit: ReturnType<typeof useForm<SignUpFormData>>['handleSubmit'];
  control: ReturnType<typeof useForm<SignUpFormData>>['control'];
  setError: ReturnType<typeof useForm<SignUpFormData>>['setError'];
  errors: ReturnType<typeof useForm<SignUpFormData>>['formState']['errors'];
  isValid: ReturnType<typeof useForm<SignUpFormData>>['formState']['isValid'];
  reset: ReturnType<typeof useForm<SignUpFormData>>['reset'];
};

export type UseRegistrationReturn = {
  registerNewUser: (
    data: SignUpFormData,
    reset: () => void
  ) => Promise<boolean>;
  isLoading: boolean;
  error: ApiError | unknown;
  isSuccess: boolean;
  setIsSuccess: (value: boolean) => void;
  userData: SignUpFormData | null;
};
export type UseSignUpFormReturn = UseSignUpFormValidationReturn &
  Omit<UseRegistrationReturn, 'registerNewUser'> & {
    onSubmit: (data: SignUpFormData) => Promise<void>;
  };
