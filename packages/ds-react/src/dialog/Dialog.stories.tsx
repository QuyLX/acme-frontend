import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/Button';
import { Dialog, DialogTrigger } from './Dialog';

const meta = {
  title: 'Foundation/Dialog',
  component: Dialog,
  args: { title: 'Rename instance', children: 'Dialog content' },
  render: (args) => (
    <DialogTrigger>
      <Button variant="secondary">Open dialog</Button>
      <Dialog {...args}>
        {(close) => (
          <>
            <p className="text-sm text-fg-muted">Choose a new name for web-01.</p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onPress={close}>Cancel</Button>
              <Button onPress={close}>Save</Button>
            </div>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NotDismissable: Story = { args: { isDismissable: false } };
