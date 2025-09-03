import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui';
import { Modal } from '@/widgets/modal/Modal';
import { ReactElement } from 'react';

type Props = {
  open: boolean;
  userEmail: string;
  onConfirmed: () => void;
  onCanceled: () => void;
  errorMessage?: string;
  className?: string;
};
export function LogoutModal({
  open,
  userEmail,
  onConfirmed,
  onCanceled,
  errorMessage,
  className,
}: Props): ReactElement {
  return (
    <Modal
      showCloseButton={true}
      open={open}
      onClose={onCanceled}
      title="Log Out"
      className={cn('border-dark-100 rounded-xs border-1', className)}
      size={'md'}
    >
      <p>
        Are you really want to log out of your account{' '}
        {userEmail && <span className={'bold-text-16'}>“{userEmail}”</span>}?
      </p>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className={'lgs:pt-0 flex flex-col gap-3 pt-6 lg:flex-row lg:gap-3'}>
        <Button variant={'outlined'} onClick={onConfirmed}>
          Yes
        </Button>
        <Button variant={'primary'} onClick={onCanceled}>
          No
        </Button>
      </div>
    </Modal>
  );
}
