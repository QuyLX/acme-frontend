import type { ComponentDoc } from '../doc';
import type { TabsProps } from './Tabs';

export default {
  name: 'Tabs',
  status: 'experimental',
  summary: 'Switches between related panels of one view. Compose Tabs > TabList (aria-label) > Tab, followed by one TabPanel per Tab with the same id.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
  contract: 'DS-TABS',
  props: {
    children: 'A TabList followed by the TabPanels.',
    selectedKey: 'Controlled selected tab id (e.g. synced with a URL search param).',
    defaultSelectedKey: 'Initially selected tab id when uncontrolled; default is the first enabled tab.',
    onSelectionChange: 'Called with the id of the newly selected tab.',
    disabledKeys: 'Ids of tabs that cannot be selected.',
    keyboardActivation: 'automatic (default): arrow keys select; manual: arrow keys focus and Enter/Space select (use when a panel is expensive to render).',
    isDisabled: 'Disables every tab.',
  },
  do: ['Keep tab labels short (one or two words).', 'Mirror the selected tab in the URL when users may share or reload the view.'],
  dont: ['Do not use Tabs for steps of a flow; users expect tabs to be independent.', 'Do not use Tabs for site navigation between pages; use Link.'],
} satisfies ComponentDoc<TabsProps>;
