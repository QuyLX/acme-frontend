import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = { title: 'Feedback/ProgressBar', component: ProgressBar, args: { label: 'Uploading image', value: 40 } } satisfies Meta<typeof ProgressBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = {};
export const Complete: Story = { args: { value: 100 } };
export const CustomValueLabel: Story = { args: { label: 'Attaching volumes', minValue: 0, maxValue: 10, value: 3, valueLabel: '3 of 10 volumes' } };
export const Indeterminate: Story = { args: { label: 'Preparing snapshot', isIndeterminate: true, value: undefined } };
export const Spinner: Story = { args: { variant: 'spinner', label: 'Loading instances', value: undefined } };
