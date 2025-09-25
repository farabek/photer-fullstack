'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { ComponentProps, ReactElement, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { IconSprite } from '@/shared/ui';

export type ModalSize = 'lg' | 'md' | 'sm';

export type ModalProps = {
  onClose?: () => void;
  open: boolean;
  showCloseButton?: boolean;
  size?: ModalSize;
  title?: string;
  headerContent?: ReactNode;
  showHeader?: boolean;
} & ComponentProps<'div'>;

export const Modal = ({
  children,
  className,
  onClose,
  open = false,
  showCloseButton = true,
  size = 'md',
  title,
  headerContent,
  showHeader = true,
}: ModalProps): ReactElement => {
  const handleModalClosed = (): void => {
    onClose?.();
  };
  const modalWidth = {
    sm: 'w-[367px]',
    md: 'w-[532px]',
    lg: 'w-[764px]',
  };

  return (
    <Dialog onOpenChange={handleModalClosed} open={open} modal={false}>
      {open && (
        <DialogPortal forceMount>
          <DialogOverlay
            className="fixed inset-0 z-[998] bg-black/50"
            data-testid="dialog-overlay"
          />
          <DialogContent
            className={cn(
              className,
              'bg-dark-300 text-light-100 fixed top-1/2 left-1/2 z-[999] max-h-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 transform overflow-auto',
              modalWidth[size]
            )}
            forceMount
            data-testid="confirm-dialog"
          >
            <DialogTitle className="sr-only" data-testid="dialog-title">
              {title || 'Modal dialog'}
            </DialogTitle>
            {showHeader && (
              <header className="border-dark-100 h1-text flex items-center justify-between border-b px-6 py-3">
                {headerContent ? (
                  headerContent
                ) : (
                  <>
                    <DialogTitle asChild>
                      <h2>{title}</h2>
                    </DialogTitle>
                    {showCloseButton && (
                      <DialogClose className="hover:bg-dark-100 focus-visible:bg-dark-100 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-all duration-100 focus-visible:outline-none">
                        <IconSprite iconName="close" />
                      </DialogClose>
                    )}
                  </>
                )}
              </header>
            )}
            <div className="regular-text-16 relative px-6 py-[23px] pb-[36px]">
              {children}
            </div>
          </DialogContent>
        </DialogPortal>
      )}
    </Dialog>
  );
};
