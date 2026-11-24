import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = { title: 'Form/Textarea', component: Textarea, args: { label: 'Description' } } satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: 'Up to 500 characters.', rows: 5 } };
export const Required: Story = { args: { isRequired: true } };
export const Invalid: Story = { args: { isInvalid: true, errorMessage: 'Description is too long.' } };
export const Disabled: Story = { args: { isDisabled: true, defaultValue: 'Primary web server' } };
