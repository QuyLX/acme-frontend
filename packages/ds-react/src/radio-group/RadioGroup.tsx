'use client';
import {
  FieldError,
  Label,
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
  Text,
  type RadioGroupProps as RACRadioGroupProps,
  type RadioProps as RACRadioProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cx } from '../cx';

export interface RadioGroupProps extends Omit<RACRadioGroupProps, 'className' | 'style' | 'children' | 'render'> {
  /** Visible group label; required so the group has an accessible name. */
  label: string;
  /** Help text below the options, linked via aria-describedby. */
  description?: string;
  /** Error shown when the group is invalid (isInvalid or failed validation). */
  errorMessage?: string;
  /** `Radio` elements. */
  children: ReactNode;
}

export interface RadioProps extends Omit<RACRadioProps, 'className' | 'style' | 'children' | 'render'> {
  /** Visible label of the option. */
  children: ReactNode;
}

export function RadioGroup({ label, description, errorMessage, children, ...props }: RadioGroupProps) {
  return (
    <RACRadioGroup {...props} className="group flex flex-col gap-2">
      <Label className="text-sm font-medium text-fg">{label}</Label>
      <div className="flex gap-2 group-data-[orientation=horizontal]:flex-row group-data-[orientation=horizontal]:gap-4 group-data-[orientation=vertical]:flex-col">
        {children}
      </div>
      {description && <Text slot="description" className="text-xs text-fg-muted">{description}</Text>}
      <FieldError className="text-xs text-danger-text">{errorMessage}</FieldError>
    </RACRadioGroup>
  );
}

export function Radio({ children, ...props }: RadioProps) {
  return (
    <RACRadio {...props} className="group inline-flex items-center gap-2 text-sm text-fg data-disabled:cursor-not-allowed data-disabled:opacity-50">
      <span
        aria-hidden="true"
        className={cx(
          'flex size-4 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface',
          'group-data-selected:border-accent group-data-invalid:border-danger',
          'group-data-focus-visible:ring-2 group-data-focus-visible:ring-focus group-data-focus-visible:ring-offset-2 group-data-focus-visible:ring-offset-canvas',
        )}
      >
        <span className="size-2 rounded-full bg-accent opacity-0 group-data-selected:opacity-100" />
      </span>
      {children}
    </RACRadio>
  );
}
