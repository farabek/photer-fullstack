'use client';
import { Button } from '@/shared/ui';
import { Modal } from '@/widgets/modal/Modal';
import React from 'react';

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirmAction: () => void;
  onCancelAction: () => void;
};

export function ConfirmationDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirmAction,
  onCancelAction,
}: ConfirmationDialogProps): React.ReactElement {
  return (
    <Modal
      open={open}
      showCloseButton
      onClose={onCancelAction}
      title={title}
      size="sm"
    >
      <div className="flex flex-col gap-6">
        <p className="regular-text-16 text-light-100">{message}</p>

        <div className="flex justify-end gap-3">
          <Button variant="outlined" onClick={onCancelAction}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirmAction}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
