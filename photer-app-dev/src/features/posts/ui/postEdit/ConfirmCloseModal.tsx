import { Button } from '@/shared/ui/button/Button';
import { Modal } from '@/widgets/modal/Modal';
import { ReactNode } from 'react';

type Props = {
  open: boolean;
  close: () => void;
  onAccept: () => void;
  onDecline: () => void;
};
export const ConfirmCloseModal = ({
  open,
  close,
  onAccept,
  onDecline,
}: Props): ReactNode => {
  return (
    <Modal open={open} onClose={close} title="Close Post">
      <p className="mt-[7px] mb-[30px]">
        Do you really want to close the edition of the publication? If you close
        changes won’t be saved
      </p>
      <div className="flex justify-end gap-[24px]">
        <Button variant="outlined" className="w-[96px]" onClick={onAccept}>
          Yes
        </Button>
        <Button className="w-[96px]" onClick={onDecline}>
          No
        </Button>
      </div>
    </Modal>
  );
};
