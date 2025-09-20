import { Button } from '@/shared/ui/button/Button';
import { Modal } from '@/widgets/modal/Modal';
import { ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export const FileValidationModal = ({
  open,
  onClose,
  title = 'Invalid File',
  message = 'The photo must be less than 20 Mb and have JPEG or PNG format',
}: Props): ReactNode => {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="mt-[7px] mb-[30px] text-center">{message}</p>
      <div className="flex justify-center">
        <Button className="w-[120px]" onClick={onClose}>
          OK
        </Button>
      </div>
    </Modal>
  );
};
