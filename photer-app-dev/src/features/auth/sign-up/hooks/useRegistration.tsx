'use client';

import { useState } from 'react';
import { useRegisterMutation } from '../../api/authApi';
import type { SignUpFormData } from './validationSchema';
import { UseRegistrationReturn } from '../types/useSignUpFormReturn';
import { useDispatch } from 'react-redux';
import { openModal } from '@/shared/state/slices/modalSlice';
import { useRouter } from 'next/navigation';

export function useRegistration(): UseRegistrationReturn {
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<SignUpFormData | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const registerNewUser = async (
    data: SignUpFormData,
    reset?: () => void
  ): Promise<boolean> => {
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    setUserData(data);
    try {
      await registerUser(payload).unwrap();
      dispatch(
        openModal({
          type: 'auth',
          props: {
            email: data.email,
          },
        })
      );
      reset?.();
      return true;
    } catch (error) {
      console.log('Registration failed:', error);

      return false;
    }
  };

  return {
    registerNewUser,
    isLoading,
    error,
    isSuccess,
    setIsSuccess,
    userData,
  };
}
