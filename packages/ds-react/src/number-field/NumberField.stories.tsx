import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberField } from './NumberField';

const meta = {
  title: 'Form/NumberField',
  component: NumberField,
  args: { label: 'Instance count', defaultValue: 2, minValue: 1, maxValue: 10 },
} satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: 'Between 1 and 10 instances.' } };
export const Percent: Story = { args: { label: 'CPU alert threshold', defaultValue: 0.8, minValue: 0, maxValue: 1, step: 0.05, formatOptions: { style: 'percent' } } };
export const Invalid: Story = { args: { isInvalid: true, errorMessage: 'Quota allows at most 5 instances.' } };
export const Disabled: Story = { args: { isDisabled: true } };
