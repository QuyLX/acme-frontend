import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './RadioGroup';

const options = (
  <>
    <Radio value="small">Small (2 vCPU)</Radio>
    <Radio value="medium">Medium (4 vCPU)</Radio>
    <Radio value="large" isDisabled>Large (8 vCPU, unavailable)</Radio>
  </>
);

const meta = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
  args: { label: 'Instance size', children: options },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: 'medium' } };
export const Horizontal: Story = { args: { orientation: 'horizontal' } };
export const WithDescription: Story = { args: { description: 'You can resize the instance later.' } };
export const Invalid: Story = { args: { isInvalid: true, errorMessage: 'Choose an instance size.' } };
export const Disabled: Story = { args: { isDisabled: true, defaultValue: 'small' } };
