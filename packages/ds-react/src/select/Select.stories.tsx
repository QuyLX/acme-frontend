import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const regions = [
  { id: 'region-a', label: 'Region A' },
  { id: 'region-b', label: 'Region B' },
  { id: 'region-c', label: 'Region C (maintenance)', isDisabled: true },
];

const meta = { title: 'Foundation/Select', component: Select, args: { label: 'Region', options: regions } } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: 'Resources are created in this region.' } };
export const Invalid: Story = { args: { isInvalid: true, errorMessage: 'Choose a region.' } };
export const Disabled: Story = { args: { isDisabled: true } };
