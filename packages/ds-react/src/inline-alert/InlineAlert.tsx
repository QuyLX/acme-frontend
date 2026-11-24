import { IconDanger, IconInfo, IconSuccess, IconWarning } from '@platform/ds-icons';
import type { ReactNode } from 'react';
import { cx } from '../cx';

export type InlineAlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface InlineAlertProps {
  /** Semantic tone. danger and warning are announced immediately (role alert); info and success politely (role status). */
  tone?: InlineAlertTone;
  /** Short visible title that states the situation; the tone is never conveyed by color alone. */
  title: string;
  /** Detail and next step. May contain a Link or Button. */
  children?: ReactNode;
}

const tones: Record<InlineAlertTone, string> = {
  info: 'border-info-text bg-info-subtle text-info-text',
  success: 'border-success-text bg-success-subtle text-success-text',
  warning: 'border-warning-text bg-warning-subtle text-warning-text',
  danger: 'border-danger-text bg-danger-subtle text-danger-text',
};

const icons: Record<InlineAlertTone, ReactNode> = {
  info: <IconInfo weight="light" placement="leading-text" />,
  success: <IconSuccess weight="light" placement="leading-text" />,
  warning: <IconWarning weight="light" placement="leading-text" />,
  danger: <IconDanger weight="light" placement="leading-text" />,
};

export function InlineAlert({ tone = 'info', title, children }: InlineAlertProps) {
  const urgent = tone === 'danger' || tone === 'warning';
  return (
    <div role={urgent ? 'alert' : 'status'} className={cx('flex gap-3 rounded-md border-l-4 p-3 text-sm', tones[tone])}>
      {icons[tone]}
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{title}</p>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
