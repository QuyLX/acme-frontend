import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/Button';
import { Tooltip, TooltipTrigger } from './Tooltip';

const meta = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  args: { children: 'Copies the instance ID to the clipboard' },
  render: (args) => (
    <TooltipTrigger>
      <Button variant="ghost" size="sm">Copy ID</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Bottom: Story = { args: { placement: 'bottom' } };
export const OpenByDefault: Story = {
  render: (args) => (
    <TooltipTrigger defaultOpen>
      <Button variant="ghost" size="sm">Copy ID</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
};
export const DisabledTrigger: Story = {
  render: (args) => (
    <TooltipTrigger isDisabled>
      <Button variant="ghost" size="sm">Copy ID</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
};
