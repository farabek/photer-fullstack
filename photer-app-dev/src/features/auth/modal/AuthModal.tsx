'use client';
import { Modal } from '@/widgets/modal/Modal';
import { Button } from '@/shared/ui';
import { closeModal } from '@/shared/state/slices/modalSlice';
import { RootState, useAppDispatch } from '@/shared/state/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export function AuthModal(): React.ReactElement | null {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isOpen, type, props } = useSelector(
    (state: RootState) => state.modal
  );

  if (!isOpen || type !== 'auth') {
    return null;
  }

  const handleConfirmEmail = () => {
    dispatch(closeModal());
    router.push('/confirm-email');
  };

  return (
    <Modal
      open={isOpen}
      title={'Email sent'}
      size={'sm'}
      onClose={() => dispatch(closeModal())}
    >
      <div className="flex flex-col gap-4">
        <p className="text-center">
          {`We have sent a confirmation code to ${props.email || ''}`}
        </p>
        <p className="text-center text-sm text-gray-400">
          Please check your email and enter the confirmation code to activate
          your account.
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={handleConfirmEmail} className="w-[140px]">
            Confirm Email
          </Button>
          <Button
            onClick={() => dispatch(closeModal())}
            variant="outlined"
            className="w-[96px]"
          >
            Later
          </Button>
        </div>
      </div>
    </Modal>
  );
}
