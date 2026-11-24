import type { ComponentDoc } from '../doc';
import type { BreadcrumbsProps } from './Breadcrumbs';

export default {
  name: 'Breadcrumbs',
  status: 'experimental',
  summary: 'Shows where the current page sits in the hierarchy and links to its ancestors. Children are Breadcrumb items; the last one is the current page.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',
  contract: 'DS-BREADCRUMBS',
  props: {
    children: 'Breadcrumb elements from the root to the current page; ancestors have href, the last item has none.',
    'aria-label': 'Landmark name; default "Breadcrumbs". Change only when a page has two breadcrumb trails.',
    isDisabled: 'Disables every link (e.g. while a blocking flow is in progress).',
    onAction: 'Called with the Breadcrumb id when an item is activated (for routers that need it).',
  },
  do: ['Start at the module root, end at the current page.', 'Use the same page names as the page titles.'],
  dont: ['Do not use breadcrumbs for the steps of a flow.', 'Do not make the current page a link.'],
} satisfies ComponentDoc<BreadcrumbsProps>;
