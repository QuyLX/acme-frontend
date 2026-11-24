'use client';
import { Dialog, Heading, OverlayArrow, Popover as RACPopover, type PopoverProps as RACPopoverProps } from 'react-aria-components';
import type { ReactNode } from 'react';

export type PopoverPlacement = 'bottom' | 'top' | 'start' | 'end' | 'bottom start' | 'bottom end' | 'top start' | 'top end';

export interface PopoverProps extends Omit<RACPopoverProps, 'className' | 'style' | 'children' | 'render' | 'placement'> {
  /** Visible title; also the accessible name of the popover dialog. */
  title: string;
  /** Content, or a render function receiving `close`. */
  children: ReactNode | ((close: () => void) => ReactNode);
  /** Where the popover opens relative to its trigger. Default `bottom`. */
  placement?: PopoverPlacement;
}

export function Popover({ title, children, placement = 'bottom', ...props }: PopoverProps) {
  return (
    <RACPopover
      {...props}
      placement={placement}
      className="group max-w-sm rounded-md border border-border bg-surface text-fg shadow-md outline-none"
    >
      <OverlayArrow className="group">
        <svg aria-hidden="true" viewBox="0 0 12 12" className="block size-3 fill-surface stroke-border group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90">
          <path d="M0 0 L6 6 L12 0" />
        </svg>
      </OverlayArrow>
      <Dialog className="flex flex-col gap-2 p-4 outline-none">
        {({ close }) => (
          <>
            <Heading slot="title" className="text-md font-semibold">
              {title}
            </Heading>
            {typeof children === 'function' ? children(close) : children}
          </>
        )}
      </Dialog>
    </RACPopover>
  );
}
