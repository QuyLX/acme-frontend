'use client';
import { OverlayArrow, Tooltip as RACTooltip, type TooltipProps as RACTooltipProps } from 'react-aria-components';
import type { ReactNode } from 'react';

export { TooltipTrigger } from 'react-aria-components';
export type { TooltipTriggerComponentProps as TooltipTriggerProps } from 'react-aria-components';

export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

export interface TooltipProps extends Omit<RACTooltipProps, 'className' | 'style' | 'children' | 'render' | 'placement'> {
  /** Short plain-text hint. Never put interactive content in a tooltip. */
  children: ReactNode;
  /** Preferred side relative to the trigger; flips when there is no room. Default `top`. */
  placement?: TooltipPlacement;
}

export function Tooltip({ children, placement = 'top', ...props }: TooltipProps) {
  return (
    <RACTooltip {...props} placement={placement} className="group max-w-xs rounded-sm bg-fg px-2 py-1 text-xs text-canvas shadow-sm">
      <OverlayArrow>
        <svg aria-hidden="true" viewBox="0 0 8 8" className="block size-2 fill-fg group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90">
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </RACTooltip>
  );
}
