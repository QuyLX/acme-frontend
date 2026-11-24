'use client';
import { IconChevronDown } from '@platform/ds-icons';
import {
  Button as RACButton,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as RACSelect,
  SelectValue,
  Text,
  type Key,
  type SelectProps as RACSelectProps,
} from 'react-aria-components';
import { cx, focusRing } from '../cx';

export interface SelectOption {
  id: string;
  label: string;
  isDisabled?: boolean;
}

export interface SelectProps extends Omit<RACSelectProps<SelectOption>, 'className' | 'style' | 'children' | 'items'> {
  /** Visible label; required so the field has an accessible name. */
  label: string;
  /** Options in display order. `id` is the value reported on change. */
  options: SelectOption[];
  description?: string;
  errorMessage?: string;
}

export function Select({ label, options, description, errorMessage, placeholder = 'Select…', ...props }: SelectProps) {
  const disabledKeys: Key[] = options.filter((o) => o.isDisabled).map((o) => o.id);
  return (
    <RACSelect {...props} placeholder={placeholder} disabledKeys={disabledKeys} className="flex flex-col gap-1">
      <Label className="text-sm font-medium text-fg">{label}</Label>
      <RACButton
        className={cx(
          'flex h-10 items-center justify-between gap-2 rounded-md border border-border-strong bg-surface px-3 text-left text-sm text-fg',
          'data-disabled:cursor-not-allowed data-disabled:opacity-50',
          focusRing,
        )}
      >
        <SelectValue className="truncate data-placeholder:text-fg-muted" />
        <IconChevronDown tone="muted" />
      </RACButton>
      {description && <Text slot="description" className="text-xs text-fg-muted">{description}</Text>}
      <FieldError className="text-xs text-danger-text">{errorMessage}</FieldError>
      <Popover className="min-w-(--trigger-width) rounded-md border border-border bg-surface p-1 shadow-md">
        <ListBox items={options} className="outline-none">
          {(option) => (
            <ListBoxItem
              id={option.id}
              textValue={option.label}
              className={cx(
                'cursor-default rounded-sm px-2 py-1.5 text-sm text-fg outline-none',
                'data-focused:bg-subtle data-selected:font-semibold data-disabled:text-fg-disabled',
              )}
            >
              {option.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </RACSelect>
  );
}
