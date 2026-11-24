'use client';
import { IconCheck, IconMinus } from '@platform/ds-icons';
import {
  Cell as RACCell,
  Checkbox as RACCheckbox,
  Collection,
  Column as RACColumn,
  Row as RACRow,
  Table as RACTable,
  TableBody as RACTableBody,
  TableHeader as RACTableHeader,
  useTableOptions,
  type CellProps as RACCellProps,
  type ColumnProps as RACColumnProps,
  type RowProps as RACRowProps,
  type TableBodyProps as RACTableBodyProps,
  type TableHeaderProps as RACTableHeaderProps,
  type TableProps as RACTableProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cx } from '../cx';

export interface TableProps extends Omit<RACTableProps, 'className' | 'style' | 'render' | 'aria-label'> {
  /** Required accessible name, e.g. "Instances". */
  'aria-label': string;
}

export type TableHeaderProps<T extends object = object> = Omit<RACTableHeaderProps<T>, 'className' | 'style' | 'render'>;

export interface ColumnProps extends Omit<RACColumnProps, 'className' | 'style' | 'children' | 'render'> {
  /** Visible column title. */
  children: ReactNode;
}

export type TableBodyProps<T extends object = object> = Omit<RACTableBodyProps<T>, 'className' | 'style' | 'render'>;
export type RowProps<T extends object = object> = Omit<RACRowProps<T>, 'className' | 'style' | 'render'>;

export interface CellProps extends Omit<RACCellProps, 'className' | 'style' | 'children' | 'render'> {
  children?: ReactNode;
}

/** Inset focus outline for grid rows and cells (token: color.focus). */
const gridFocus = 'outline-none data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus';

function SelectionCheckbox() {
  return (
    <RACCheckbox slot="selection" className="group flex items-center justify-center">
      {({ isSelected, isIndeterminate }) => (
        <span
          aria-hidden="true"
          className={cx(
            'flex size-4 items-center justify-center rounded-sm border border-border-strong bg-surface text-fg-on-accent',
            'group-data-focus-visible:ring-2 group-data-focus-visible:ring-focus group-data-focus-visible:ring-offset-2',
            (isSelected || isIndeterminate) && 'border-accent bg-accent',
          )}
        >
          {isIndeterminate ? (
            <IconMinus size="xs" weight="bold" />
          ) : isSelected ? (
            <IconCheck size="xs" weight="bold" />
          ) : null}
        </span>
      )}
    </RACCheckbox>
  );
}

export function Table(props: TableProps) {
  return (
    <div className="overflow-auto rounded-md border border-border bg-surface">
      <RACTable {...props} className="w-full border-collapse text-left text-sm text-fg" />
    </div>
  );
}

export function TableHeader<T extends object = object>({ columns, children, ...props }: TableHeaderProps<T>) {
  const { selectionBehavior, selectionMode } = useTableOptions();
  return (
    <RACTableHeader {...props} className="border-b border-border bg-subtle">
      {selectionBehavior === 'toggle' && (
        <RACColumn className={cx('w-10 px-3 py-2', gridFocus)}>
          {selectionMode === 'multiple' ? <SelectionCheckbox /> : <span className="sr-only">Selection</span>}
        </RACColumn>
      )}
      <Collection items={columns}>{children}</Collection>
    </RACTableHeader>
  );
}

export function Column({ children, ...props }: ColumnProps) {
  return (
    <RACColumn {...props} className={cx('group px-3 py-2 text-xs font-semibold text-fg-muted data-allows-sorting:cursor-pointer', gridFocus)}>
      {({ allowsSorting, sortDirection }) => (
        <span className="inline-flex items-center gap-1">
          {children}
          {/* Sort indicator stays inline: its visibility and rotation are column state, not an icon variant. */}
          {allowsSorting && (
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className={cx('size-3', !sortDirection && 'opacity-0 group-data-hovered:opacity-100', sortDirection === 'descending' && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 10l4-4 4 4" />
            </svg>
          )}
        </span>
      )}
    </RACColumn>
  );
}

export function TableBody<T extends object = object>(props: TableBodyProps<T>) {
  return <RACTableBody {...props} className="divide-y divide-border data-empty:text-fg-muted" />;
}

export function Row<T extends object = object>({ columns, children, ...props }: RowProps<T>) {
  const { selectionBehavior } = useTableOptions();
  return (
    <RACRow
      {...props}
      columns={columns}
      className={cx(
        'cursor-default data-hovered:bg-subtle data-selected:bg-subtle data-disabled:text-fg-disabled',
        'data-href:cursor-pointer',
        gridFocus,
      )}
    >
      {selectionBehavior === 'toggle' && (
        <RACCell className={cx('px-3 py-2', gridFocus)}>
          <SelectionCheckbox />
        </RACCell>
      )}
      <Collection items={columns}>{children}</Collection>
    </RACRow>
  );
}

export function Cell({ children, ...props }: CellProps) {
  return (
    <RACCell {...props} className={cx('px-3 py-2', gridFocus)}>
      {children}
    </RACCell>
  );
}
