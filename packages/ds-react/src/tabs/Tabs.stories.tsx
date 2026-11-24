import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

const meta = {
  title: 'Structure/Tabs',
  component: Tabs,
  args: {
    children: (
      <>
        <TabList aria-label="Instance details">
          <Tab id="overview">Overview</Tab>
          <Tab id="network">Network</Tab>
          <Tab id="monitoring">Monitoring</Tab>
        </TabList>
        <TabPanel id="overview">CPU, memory and status of the instance.</TabPanel>
        <TabPanel id="network">Interfaces and security groups.</TabPanel>
        <TabPanel id="monitoring">Metrics for the last 24 hours.</TabPanel>
      </>
    ),
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SecondSelected: Story = { args: { defaultSelectedKey: 'network' } };
export const WithDisabledTab: Story = { args: { disabledKeys: ['monitoring'] } };
export const ManualActivation: Story = { args: { keyboardActivation: 'manual' } };
