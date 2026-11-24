import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta = { title: 'Feedback/Skeleton', component: Skeleton, args: {} } satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextLine: Story = {};
export const Paragraph: Story = { args: { lines: 3 } };
export const Block: Story = { args: { shape: 'block' } };
export const Circle: Story = { args: { shape: 'circle' } };
export const CardPlaceholder: Story = {
  render: () => (
    <section aria-busy="true" aria-label="Instance summary" className="flex w-80 gap-3 rounded-md border border-border bg-surface p-4">
      <Skeleton shape="circle" />
      <Skeleton lines={2} />
    </section>
  ),
};
