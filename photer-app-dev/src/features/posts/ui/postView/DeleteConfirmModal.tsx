import { Button } from '@/shared/ui/button/Button';
import { Modal } from '@/widgets/modal/Modal';
import { ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onYes: () => void;
  onNo: () => void;
};

export const DeleteConfirmModal = ({
  open,
  onClose,
  onYes,
  onNo,
}: Props): ReactNode => {
  return (
    <Modal open={open} onClose={onClose} title="Delete Post">
      <p className="mt-[7px] mb-[30px] text-center">
        Are you sure you want to delete this post?
      </p>
      <div className="flex justify-center gap-[24px]">
        <Button variant="outlined" className="w-[96px]" onClick={onNo}>
          No
        </Button>
        <Button className="w-[96px]" onClick={onYes}>
          Yes
        </Button>
      </div>
    </Modal>
  );
};
