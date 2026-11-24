import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = { title: 'Foundation/TextField', component: TextField, args: { label: 'Instance name' } } satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: 'Lowercase letters, digits and hyphens.' } };
export const Required: Story = { args: { isRequired: true } };
export const Invalid: Story = { args: { isInvalid: true, errorMessage: 'Name is already taken.' } };
export const Disabled: Story = { args: { isDisabled: true, defaultValue: 'web-01' } };
