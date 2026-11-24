import type { ReactNode } from 'react';
import { cx } from '../cx';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  /** Semantic tone. Color is never the only signal: the text must state the status. */
  tone?: BadgeTone;
  /** Status text, e.g. "Running". */
  children: ReactNode;
}

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-subtle text-fg',
  info: 'bg-info-subtle text-info-text',
  success: 'bg-success-subtle text-success-text',
  warning: 'bg-warning-subtle text-warning-text',
  danger: 'bg-danger-subtle text-danger-text',
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={cx('inline-flex h-6 items-center rounded-full px-2 text-xs font-medium', tones[tone])}>{children}</span>;
}
