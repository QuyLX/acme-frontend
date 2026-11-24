import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/Button';
import { createToastQueue, showToast, ToastRegion, type ToastContent, type ToastRegionProps } from './Toast';

function ToastDemo({ queue, content }: ToastRegionProps & { content: ToastContent }) {
  return (
    <>
      <Button variant="secondary" onPress={() => showToast(queue, content)}>
        Show toast
      </Button>
      <ToastRegion queue={queue} />
    </>
  );
}

const meta = {
  title: 'Overlay/Toast',
  component: ToastDemo,
  args: { queue: createToastQueue(), content: { title: 'Changes saved' } },
} satisfies Meta<typeof ToastDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Success: Story = {
  args: { queue: createToastQueue(), content: { tone: 'success', title: 'Instance created', description: 'web-01 is starting.' } },
};
export const Danger: Story = {
  args: { queue: createToastQueue(), content: { tone: 'danger', title: 'Instance could not be deleted', description: 'Detach its volumes first.' } },
};
