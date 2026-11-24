import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { SortDescriptor } from 'react-aria-components';
import { Badge } from '../badge/Badge';
import { EmptyState } from '../empty-state/EmptyState';
import { Cell, Column, Row, Table, TableBody, TableHeader } from './Table';

interface Instance {
  id: string;
  name: string;
  status: 'Running' | 'Stopped';
  vcpu: number;
}

const instances: Instance[] = [
  { id: 'i-1', name: 'web-01', status: 'Running', vcpu: 2 },
  { id: 'i-2', name: 'db-01', status: 'Stopped', vcpu: 8 },
  { id: 'i-3', name: 'cache-01', status: 'Running', vcpu: 4 },
];

function InstanceRows({ items }: { items: Instance[] }) {
  return (
    <TableBody items={items} renderEmptyState={() => <EmptyState title="No instances yet" description="Instances you create appear here." headingLevel={3} />}>
      {(item) => (
        <Row id={item.id}>
          <Cell>{item.name}</Cell>
          <Cell>
            <Badge tone={item.status === 'Running' ? 'success' : 'neutral'}>{item.status}</Badge>
          </Cell>
          <Cell>{item.vcpu}</Cell>
        </Row>
      )}
    </TableBody>
  );
}

function InstanceHeader({ sortable = false }: { sortable?: boolean }) {
  return (
    <TableHeader>
      <Column id="name" isRowHeader allowsSorting={sortable}>Name</Column>
      <Column id="status">Status</Column>
      <Column id="vcpu" allowsSorting={sortable}>vCPU</Column>
    </TableHeader>
  );
}

function SortableInstances() {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'name', direction: 'ascending' });
  const sorted = [...instances].sort((a, b) => {
    const key = sort.column as 'name' | 'vcpu';
    const order = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
    return sort.direction === 'descending' ? -order : order;
  });
  return (
    <Table aria-label="Instances" sortDescriptor={sort} onSortChange={setSort}>
      <InstanceHeader sortable />
      <InstanceRows items={sorted} />
    </Table>
  );
}

const meta = {
  title: 'Structure/Table',
  component: Table,
  args: { 'aria-label': 'Instances' },
  render: (args) => (
    <Table {...args}>
      <InstanceHeader />
      <InstanceRows items={instances} />
    </Table>
  ),
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sortable: Story = { render: () => <SortableInstances /> };
export const MultipleSelection: Story = { args: { selectionMode: 'multiple', defaultSelectedKeys: ['i-2'] } };
export const SingleSelection: Story = { args: { selectionMode: 'single' } };
export const DisabledRows: Story = { args: { selectionMode: 'multiple', disabledKeys: ['i-2'] } };
export const Empty: Story = {
  render: (args) => (
    <Table {...args}>
      <InstanceHeader />
      <InstanceRows items={[]} />
    </Table>
  ),
};
