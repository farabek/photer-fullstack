import { Button } from '@/shared/ui';
import { Modal } from '@/widgets/modal/Modal';

export function EmailSentModal({
  email,
  open,
  onClose,
}: {
  email: string;
  open: boolean;
  onClose: () => void;
}): React.ReactElement {
  return (
    <>
      <Modal
        open={open}
        showCloseButton
        onClose={onClose}
        title="Email sent"
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <p>We have sent a link to confirm your email to {email}</p>
          <Button onClick={onClose} className="right-0 w-[96px]">
            OK
          </Button>
        </div>
      </Modal>
    </>
  );
}
