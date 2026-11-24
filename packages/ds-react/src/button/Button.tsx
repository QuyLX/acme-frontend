'use client';
import { Button as RACButton, ProgressBar, type ButtonProps as RACButtonProps } from 'react-aria-components';
import type { ReactNode } from 'react';
import { cx, focusRing } from '../cx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends Omit<RACButtonProps, 'className' | 'style' | 'children'> {
  /** Visual emphasis. `danger` is reserved for destructive actions. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Visible label. Icon-only buttons must pass `aria-label`. */
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-fg-on-accent data-hovered:bg-accent-hover',
  secondary: 'bg-surface text-fg border border-border-strong data-hovered:bg-subtle',
  danger: 'bg-danger text-fg-on-accent data-hovered:bg-danger-hover',
  ghost: 'bg-transparent text-fg data-hovered:bg-subtle',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

export function Button({ variant = 'primary', size = 'md', children, ...props }: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ease-standard',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pending:cursor-wait',
        focusRing,
        variants[variant],
        sizes[size],
      )}
    >
      {({ isPending }) => (
        <>
          {isPending && (
            <ProgressBar isIndeterminate aria-label="Loading" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {children}
        </>
      )}
    </RACButton>
  );
}
