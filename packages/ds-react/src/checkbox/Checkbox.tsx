'use client';
import { IconCheck, IconMinus } from '@platform/ds-icons';
import { Checkbox as RACCheckbox, type CheckboxProps as RACCheckboxProps } from 'react-aria-components';
import type { ReactNode } from 'react';
import { cx } from '../cx';

export interface CheckboxProps extends Omit<RACCheckboxProps, 'className' | 'style' | 'children'> {
  /** Visible label. */
  children: ReactNode;
}

export function Checkbox({ children, ...props }: CheckboxProps) {
  return (
    <RACCheckbox {...props} className="group inline-flex items-center gap-2 text-sm text-fg data-disabled:opacity-50">
      {({ isSelected, isIndeterminate }) => (
        <>
          <span
            aria-hidden="true"
            className={cx(
              'flex size-4 items-center justify-center rounded-sm border border-border-strong bg-surface text-fg-on-accent',
              'group-data-focus-visible:ring-2 group-data-focus-visible:ring-focus group-data-focus-visible:ring-offset-2',
              (isSelected || isIndeterminate) && 'border-accent bg-accent',
              'group-data-invalid:border-danger',
            )}
          >
            {isIndeterminate ? (
              <IconMinus size="xs" weight="bold" />
            ) : isSelected ? (
              <IconCheck size="xs" weight="bold" />
            ) : null}
          </span>
          {children}
        </>
      )}
    </RACCheckbox>
  );
}
