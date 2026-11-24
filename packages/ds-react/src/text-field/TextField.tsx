'use client';
import { FieldError, Input, Label, Text, TextField as RACTextField, type TextFieldProps as RACTextFieldProps } from 'react-aria-components';
import { cx, focusRing } from '../cx';

export interface TextFieldProps extends Omit<RACTextFieldProps, 'className' | 'style' | 'children'> {
  /** Visible label; required so every field has an accessible name. */
  label: string;
  /** Help text shown below the input and linked via aria-describedby. */
  description?: string;
  /** Error shown when the field is invalid (isInvalid or failed validation). */
  errorMessage?: string;
  placeholder?: string;
}

export function TextField({ label, description, errorMessage, placeholder, ...props }: TextFieldProps) {
  return (
    <RACTextField {...props} className="flex flex-col gap-1">
      <Label className="text-sm font-medium text-fg">{label}</Label>
      <Input
        placeholder={placeholder}
        className={cx(
          'h-10 rounded-md border border-border-strong bg-surface px-3 text-sm text-fg placeholder:text-fg-muted',
          'data-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:opacity-50',
          focusRing,
        )}
      />
      {description && <Text slot="description" className="text-xs text-fg-muted">{description}</Text>}
      <FieldError className="text-xs text-danger-text">{errorMessage}</FieldError>
    </RACTextField>
  );
}
