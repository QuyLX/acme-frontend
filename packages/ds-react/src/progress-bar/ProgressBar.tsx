'use client';
import { Label, ProgressBar as RACProgressBar, type ProgressBarProps as RACProgressBarProps } from 'react-aria-components';
import { cx } from '../cx';

export type ProgressBarVariant = 'bar' | 'spinner';

export interface ProgressBarProps extends Omit<RACProgressBarProps, 'className' | 'style' | 'children' | 'render'> {
  /** Visible label naming the operation, e.g. "Uploading image". */
  label: string;
  /** `bar` (default) for determinate or indeterminate progress; `spinner` for short indeterminate waits. */
  variant?: ProgressBarVariant;
}

export function ProgressBar({ label, variant = 'bar', isIndeterminate, ...props }: ProgressBarProps) {
  if (variant === 'spinner') {
    return (
      <RACProgressBar {...props} isIndeterminate className="inline-flex items-center gap-2 text-sm text-fg">
        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-border border-t-accent motion-reduce:animate-none" />
        <Label>{label}</Label>
      </RACProgressBar>
    );
  }
  return (
    <RACProgressBar {...props} isIndeterminate={isIndeterminate} className="flex w-full flex-col gap-1 text-sm text-fg">
      {({ percentage, valueText, isIndeterminate: indeterminate }) => (
        <>
          <div className="flex justify-between gap-2">
            <Label className="font-medium">{label}</Label>
            {!indeterminate && <span className="text-fg-muted tabular-nums">{valueText}</span>}
          </div>
          <svg aria-hidden="true" className="h-2 w-full overflow-hidden rounded-full" preserveAspectRatio="none" viewBox="0 0 100 2">
            <rect width="100" height="2" className="fill-subtle" />
            <rect
              width={indeterminate ? 100 : (percentage ?? 0)}
              height="2"
              className={cx('fill-accent', indeterminate && 'animate-pulse motion-reduce:animate-none motion-reduce:opacity-50')}
            />
          </svg>
        </>
      )}
    </RACProgressBar>
  );
}
