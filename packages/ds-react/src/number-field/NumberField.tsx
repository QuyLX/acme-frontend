'use client';
import { IconMinus, IconPlus } from '@platform/ds-icons';
import {
  Button as RACButton,
  FieldError,
  Group,
  Input,
  Label,
  NumberField as RACNumberField,
  Text,
  type NumberFieldProps as RACNumberFieldProps,
} from 'react-aria-components';
import { cx, focusRing } from '../cx';

export interface NumberFieldProps extends Omit<RACNumberFieldProps, 'className' | 'style' | 'children' | 'render'> {
  /** Visible label; required so every field has an accessible name. */
  label: string;
  /** Help text (e.g. the allowed range), linked via aria-describedby. */
  description?: string;
  /** Error shown when the field is invalid (isInvalid or failed validation). */
  errorMessage?: string;
}

const stepButton = cx(
  'flex w-8 items-center justify-center self-stretch text-fg-muted data-hovered:bg-subtle data-pressed:bg-subtle',
  'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
  focusRing,
);

export function NumberField({ label, description, errorMessage, ...props }: NumberFieldProps) {
  return (
    <RACNumberField {...props} className="flex flex-col gap-1">
      <Label className="text-sm font-medium text-fg">{label}</Label>
      <Group
        className={cx(
          'flex h-10 items-stretch overflow-hidden rounded-md border border-border-strong bg-surface',
          'data-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:opacity-50',
          'data-focus-within:ring-2 data-focus-within:ring-focus data-focus-within:ring-offset-2 data-focus-within:ring-offset-canvas',
        )}
      >
        <RACButton slot="decrement" className={cx(stepButton, 'border-r border-border')}>
          <IconMinus />
        </RACButton>
        <Input className="min-w-0 flex-1 bg-transparent px-3 text-sm text-fg tabular-nums outline-none" />
        <RACButton slot="increment" className={cx(stepButton, 'border-l border-border')}>
          <IconPlus />
        </RACButton>
      </Group>
      {description && <Text slot="description" className="text-xs text-fg-muted">{description}</Text>}
      <FieldError className="text-xs text-danger-text">{errorMessage}</FieldError>
    </RACNumberField>
  );
}
