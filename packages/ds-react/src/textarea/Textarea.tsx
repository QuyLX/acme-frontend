'use client';
import { FieldError, Label, Text, TextArea, TextField as RACTextField, type TextFieldProps as RACTextFieldProps } from 'react-aria-components';
import { cx, focusRing } from '../cx';

export type TextareaRows = 3 | 5 | 8;

export interface TextareaProps extends Omit<RACTextFieldProps, 'className' | 'style' | 'children' | 'render'> {
  /** Visible label; required so every field has an accessible name. */
  label: string;
  /** Help text shown below the input and linked via aria-describedby. */
  description?: string;
  /** Error shown when the field is invalid (isInvalid or failed validation). */
  errorMessage?: string;
  placeholder?: string;
  /** Visible height in text rows. Default 3. */
  rows?: TextareaRows;
}

export function Textarea({ label, description, errorMessage, placeholder, rows = 3, ...props }: TextareaProps) {
  return (
    <RACTextField {...props} className="flex flex-col gap-1">
      <Label className="text-sm font-medium text-fg">{label}</Label>
      <TextArea
        placeholder={placeholder}
        rows={rows}
        className={cx(
          'resize-y rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted',
          'data-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:opacity-50',
          focusRing,
        )}
      />
      {description && <Text slot="description" className="text-xs text-fg-muted">{description}</Text>}
      <FieldError className="text-xs text-danger-text">{errorMessage}</FieldError>
    </RACTextField>
  );
}
