import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialogTrigger } from '../dialog/Dialog';
import { Button } from '../button/Button';
import { Popover } from './Popover';

const meta = {
  title: 'Overlay/Popover',
  component: Popover,
  args: { title: 'Billing period', children: 'Charges are calculated hourly and invoiced monthly.' },
  render: (args) => (
    <DialogTrigger>
      <Button variant="secondary">Billing details</Button>
      <Popover {...args} />
    </DialogTrigger>
  ),
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Top: Story = { args: { placement: 'top' } };
export const WithActions: Story = {
  args: {
    title: 'Stop instance?',
    children: (close) => (
      <>
        <p className="text-sm text-fg-muted">Running processes are terminated.</p>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onPress={close}>Cancel</Button>
          <Button size="sm" onPress={close}>Stop</Button>
        </div>
      </>
    ),
  },
};
