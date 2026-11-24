import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta = { title: 'Form/Switch', component: Switch, args: { children: 'Auto-renew' } } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultSelected: true } };
export const Disabled: Story = { args: { isDisabled: true } };
export const DisabledSelected: Story = { args: { isDisabled: true, defaultSelected: true } };
