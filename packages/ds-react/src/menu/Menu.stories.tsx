import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/Button';
import { Menu, MenuItem, MenuTrigger } from './Menu';

const meta = {
  title: 'Overlay/Menu',
  component: Menu,
  args: {},
  render: (args) => (
    <MenuTrigger>
      <Button variant="secondary">Actions</Button>
      <Menu {...args}>
        <MenuItem id="start">Start</MenuItem>
        <MenuItem id="restart">Restart</MenuItem>
        <MenuItem id="resize">Resize</MenuItem>
        <MenuItem id="delete" tone="danger">Delete</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDisabledItems: Story = { args: { disabledKeys: ['start', 'resize'] } };
export const PlacementEnd: Story = { args: { placement: 'bottom end' } };
