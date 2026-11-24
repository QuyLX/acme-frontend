'use client';
import { Switch as RACSwitch, type SwitchProps as RACSwitchProps } from 'react-aria-components';
import type { ReactNode } from 'react';
import { cx } from '../cx';

export interface SwitchProps extends Omit<RACSwitchProps, 'className' | 'style' | 'children' | 'render'> {
  /** Visible label describing the setting, e.g. "Auto-renew". */
  children: ReactNode;
}

export function Switch({ children, ...props }: SwitchProps) {
  return (
    <RACSwitch {...props} className="group inline-flex items-center gap-2 text-sm text-fg data-disabled:cursor-not-allowed data-disabled:opacity-50">
      <span
        aria-hidden="true"
        className={cx(
          'flex h-5 w-9 shrink-0 items-center rounded-full bg-border-strong p-0.5 transition-colors ease-standard',
          'group-data-selected:bg-accent',
          'group-data-focus-visible:ring-2 group-data-focus-visible:ring-focus group-data-focus-visible:ring-offset-2 group-data-focus-visible:ring-offset-canvas',
        )}
      >
        <span className="size-4 rounded-full bg-surface shadow-sm transition-transform ease-standard group-data-selected:translate-x-4 motion-reduce:transition-none" />
      </span>
      {children}
    </RACSwitch>
  );
}
