import type { ComponentDoc } from '../doc';
import type { TableProps } from './Table';

export default {
  name: 'Table',
  status: 'experimental',
  summary:
    'Static data grid primitives: Table > TableHeader > Column, TableBody > Row > Cell, with optional sorting and row selection. Data loading, filtering and pagination belong to the resource-table pattern (Experience tier).',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',
  contract: 'DS-TABLE',
  props: {
    'aria-label': 'Required name of the grid, e.g. "Instances".',
    children: 'A TableHeader (Columns; mark one Column isRowHeader) and a TableBody (Rows of Cells). TableBody accepts renderEmptyState.',
    selectionMode: 'none (default), single or multiple. A checkbox column is added automatically; multiple adds "Select All".',
    selectedKeys: 'Controlled selected row ids, or "all".',
    defaultSelectedKeys: 'Initially selected row ids when uncontrolled.',
    onSelectionChange: 'Called with the new selection (a Set of ids, or "all").',
    disabledKeys: 'Row ids that cannot be selected or activated.',
    sortDescriptor: 'Controlled { column, direction }. Mark sortable columns with Column allowsSorting; the DS does not sort data.',
    onSortChange: 'Called with the next sort descriptor when a sortable column header is pressed.',
    onRowAction: 'Called with the row id when a row is activated (Enter or click with selectionMode none).',
  },
  do: ['Mark the identifying column with isRowHeader.', 'Sort on the server for paginated data; pass the descriptor through.', 'Use renderEmptyState with an EmptyState.'],
  dont: ['Do not use Table for layout.', 'Do not put more than one interactive element per cell without a reason; use a row action Menu.'],
} satisfies ComponentDoc<TableProps>;
