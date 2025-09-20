import { Button } from '@/shared/ui/button/Button';
import { Modal } from '@/widgets/modal/Modal';
import { ReactNode } from 'react';

export type ConfirmModalConfig = {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
};

type Props = {
  open: boolean;
  config: ConfirmModalConfig;
};

export const ConfirmModal = ({ open, config }: Props): ReactNode => {
  const {
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    variant = 'info',
  } = config;

  const getButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return undefined;
    }
  };

  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <p className="mt-[7px] mb-[30px] text-center">{message}</p>
      <div className="flex justify-center gap-[24px]">
        <Button variant="outlined" className="w-[96px]" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button
          variant={getButtonVariant()}
          className="w-[96px]"
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
