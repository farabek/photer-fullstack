import { Button } from '@/shared/ui/button/Button';
import { Modal } from '@/widgets/modal/Modal';
import { ReactNode } from 'react';

type Props = {
  open: boolean;
  close: () => void;
  onSaveDraft: () => void;
  onDiscard: () => void;
  onCancel: () => void;
};

export const ExitConfirmModal = ({
  open,
  close,
  onSaveDraft,
  onDiscard,
  onCancel,
}: Props): ReactNode => {
  return (
    <Modal open={open} onClose={close} title="Close Publication Creation">
      <p className="mt-[7px] mb-[30px]">
        Do you really want to close the creation of a publication? If you close everything will be deleted
      </p>
      <div className="flex justify-end gap-[24px]">
        <Button variant="outlined" className="w-[120px]" onClick={onSaveDraft}>
          Save draft
        </Button>
        <Button variant="outlined" className="w-[96px]" onClick={onDiscard}>
          Discard
        </Button>
        <Button className="w-[96px]" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
