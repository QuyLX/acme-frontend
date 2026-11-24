import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb, Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Structure/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    children: [
      <Breadcrumb key="compute" id="compute" href="#compute">Compute</Breadcrumb>,
      <Breadcrumb key="instances" id="instances" href="#instances">Instances</Breadcrumb>,
      <Breadcrumb key="web-01" id="web-01">web-01</Breadcrumb>,
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwoLevels: Story = {
  args: {
    children: [
      <Breadcrumb key="billing" id="billing" href="#billing">Billing</Breadcrumb>,
      <Breadcrumb key="invoices" id="invoices">Invoices</Breadcrumb>,
    ],
  },
};
export const Disabled: Story = { args: { isDisabled: true } };
