import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogoutMutation } from '../api/authApi';
import { useAppDispatch } from '@/shared/state/store';
import { clearSessionExpired } from '@/shared/state/slices/authSlice';

type LogoutReturn = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  confirmLogout: () => Promise<void>;
  isLoading: boolean;
  isError: boolean | undefined;
};

export function useLogout(): LogoutReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [logout, { isLoading, isError, reset }] = useLogoutMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const openModal = (): void => setIsOpen(true);
  const closeModal = (): void => {
    setIsOpen(false);
    reset();
  };

  const confirmLogout = async (): Promise<void> => {
    try {
      await logout().unwrap();
      // Сбрасываем состояние истечения сессии при выходе
      dispatch(clearSessionExpired());
      router.push('/sign-in');
      closeModal();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    confirmLogout,
    isLoading,
    isError,
  };
}
