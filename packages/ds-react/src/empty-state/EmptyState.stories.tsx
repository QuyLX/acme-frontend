import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  args: { title: 'No instances yet', description: 'Instances you create in this project appear here.' },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = { args: { action: <Button>Create instance</Button> } };
export const NoResults: Story = {
  args: {
    title: 'No instances match the filters',
    description: 'Try a different name or status.',
    action: <Button variant="secondary">Clear filters</Button>,
    headingLevel: 3,
  },
};
export const TitleOnly: Story = { args: { description: undefined } };
