import type { ComponentDoc } from '../doc';
import type { EmptyStateProps } from './EmptyState';

export default {
  name: 'EmptyState',
  status: 'experimental',
  summary: 'Explains why a list, table or section has no content and offers the next step.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/practices/headings/',
  contract: 'DS-EMPTYSTATE',
  props: {
    title: 'Required; says what is empty ("No instances yet"). Rendered as a heading.',
    description: 'Why it is empty or what the user can do.',
    action: 'Optional slot for one primary Button or a Link (e.g. "Create instance").',
    headingLevel: '2 (default), 3 or 4 so the heading fits the page outline.',
  },
  do: [
    'Distinguish "nothing created yet" from "no results for this filter" (offer "Clear filters" for the latter).',
    'Use inside Table renderEmptyState.',
  ],
  dont: ['Do not use for load errors; use an InlineAlert with tone danger.', 'Do not offer more than two actions.'],
} satisfies ComponentDoc<EmptyStateProps>;
