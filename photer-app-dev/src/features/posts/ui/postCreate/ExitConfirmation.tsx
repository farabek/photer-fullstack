import { ConfirmationDialog } from './ConfirmationDialog';
import { JSX } from 'react';

type ExitConfirmationProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ExitConfirmation({
  open,
  onConfirm,
  onCancel,
}: ExitConfirmationProps): JSX.Element {
  return (
    <ConfirmationDialog
      open={open}
      title="Close"
      message={`Do you really want to close the creation of a publication?
If you close everything will be deleted`}
      confirmText="Discard"
      cancelText="Cancel"
      onConfirmAction={onConfirm}
      onCancelAction={onCancel}
    />
  );
}
