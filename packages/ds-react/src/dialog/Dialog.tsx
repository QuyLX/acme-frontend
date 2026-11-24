'use client';
import { Dialog as RACDialog, Heading, Modal, ModalOverlay, type DialogProps as RACDialogProps } from 'react-aria-components';
import type { ReactNode } from 'react';

export { DialogTrigger } from 'react-aria-components';

export interface DialogProps extends Omit<RACDialogProps, 'className' | 'style' | 'children'> {
  /** Visible title; also the dialog's accessible name. */
  title: string;
  /** Content, or a render function receiving `close`. */
  children: ReactNode | ((close: () => void) => ReactNode);
  /** Controlled open state (omit when used inside DialogTrigger). */
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Close on outside click / Escape. Default true; set false while a required decision is pending. */
  isDismissable?: boolean;
}

export function Dialog({ title, children, isOpen, onOpenChange, isDismissable = true, ...props }: DialogProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4"
    >
      <Modal className="w-full max-w-md rounded-lg border border-border bg-surface text-fg shadow-md">
        <RACDialog {...props} className="flex flex-col gap-4 p-6 outline-none">
          {({ close }) => (
            <>
              <Heading slot="title" className="text-lg font-semibold">
                {title}
              </Heading>
              {typeof children === 'function' ? children(close) : children}
            </>
          )}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}
