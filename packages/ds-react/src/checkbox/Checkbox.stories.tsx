import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = { title: 'Foundation/Checkbox', component: Checkbox, args: { children: 'Enable monitoring' } } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultSelected: true } };
export const Indeterminate: Story = { args: { isIndeterminate: true, children: 'Select all' } };
export const Disabled: Story = { args: { isDisabled: true } };
