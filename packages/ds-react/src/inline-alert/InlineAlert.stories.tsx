import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineAlert } from './InlineAlert';

const meta = {
  title: 'Feedback/InlineAlert',
  component: InlineAlert,
  args: { title: 'Scheduled maintenance', children: 'Region A is read-only on Sunday from 02:00 to 04:00 UTC.' },
} satisfies Meta<typeof InlineAlert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { tone: 'success', title: 'Billing details verified', children: 'You can now create resources.' } };
export const Warning: Story = { args: { tone: 'warning', title: 'Quota almost reached', children: '9 of 10 instances are in use.' } };
export const Danger: Story = { args: { tone: 'danger', title: 'Instances could not be loaded', children: 'Reload the page. If the problem persists, contact support.' } };
export const TitleOnly: Story = { args: { title: 'No changes since the last deployment', children: undefined } };
