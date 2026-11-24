import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = { title: 'Foundation/Badge', component: Badge, args: { children: 'Running' } } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { children: 'Stopped' } };
export const Info: Story = { args: { tone: 'info', children: 'Provisioning' } };
export const Success: Story = { args: { tone: 'success' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Degraded' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Error' } };
