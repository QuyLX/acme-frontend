import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta = { title: 'Structure/Link', component: Link, args: { href: '#billing', children: 'View billing history' } } satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  render: (args) => (
    <p className="text-sm text-fg">
      Invoices are issued monthly. <Link {...args} />.
    </p>
  ),
};
export const Standalone: Story = { args: { variant: 'standalone' } };
export const External: Story = { args: { href: 'https://example.com/docs', target: '_blank', children: 'Pricing documentation (opens in a new tab)' } };
export const Disabled: Story = { args: { isDisabled: true } };
