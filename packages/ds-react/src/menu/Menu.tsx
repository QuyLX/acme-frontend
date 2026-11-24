'use client';
import {
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  Popover,
  type MenuItemProps as RACMenuItemProps,
  type MenuProps as RACMenuProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cx } from '../cx';

export { MenuTrigger } from 'react-aria-components';
export type { MenuTriggerProps } from 'react-aria-components';

export type MenuPlacement = 'bottom start' | 'bottom end' | 'top start' | 'top end';
export type MenuItemTone = 'default' | 'danger';

export interface MenuProps<T extends object = object> extends Omit<RACMenuProps<T>, 'className' | 'style' | 'render'> {
  /** Where the menu opens relative to its trigger. Default `bottom start`. */
  placement?: MenuPlacement;
}

export interface MenuItemProps<T extends object = object> extends Omit<RACMenuItemProps<T>, 'className' | 'style' | 'children' | 'render'> {
  /** Visible label. Pass `textValue` when children are not plain text (typeahead). */
  children: ReactNode;
  /** `danger` for destructive actions; pair with a confirmation. Default `default`. */
  tone?: MenuItemTone;
}

const tones: Record<MenuItemTone, string> = {
  default: 'text-fg',
  danger: 'text-danger-text',
};

export function Menu<T extends object = object>({ placement = 'bottom start', ...props }: MenuProps<T>) {
  return (
    <Popover placement={placement} className="min-w-40 rounded-md border border-border bg-surface p-1 shadow-md outline-none">
      <RACMenu {...props} className="max-h-80 overflow-auto outline-none" />
    </Popover>
  );
}

export function MenuItem<T extends object = object>({ tone = 'default', children, ...props }: MenuItemProps<T>) {
  return (
    <RACMenuItem
      {...props}
      className={cx(
        'flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
        'data-focused:bg-subtle data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
        tones[tone],
      )}
    >
      {children}
    </RACMenuItem>
  );
}
