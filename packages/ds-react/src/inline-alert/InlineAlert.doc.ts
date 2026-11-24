import type { ComponentDoc } from '../doc';
import type { InlineAlertProps } from './InlineAlert';

export default {
  name: 'InlineAlert',
  status: 'experimental',
  summary: 'Persistent message about a section or page (quota reached, maintenance, failed load). Stays until the condition changes.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/',
  contract: 'DS-INLINEALERT',
  props: {
    tone: 'info (default) and success use role="status" (polite); warning and danger use role="alert" (assertive).',
    title: 'Required short statement of the situation ("Quota reached").',
    children: 'Detail and the next step; may contain a Link or Button.',
  },
  do: [
    'Render the alert when the condition occurs so the live region announces it; keep it mounted while it is relevant.',
    'Say what happened and what to do next.',
  ],
  dont: [
    'Do not use danger/warning for routine information; assertive announcements interrupt users.',
    'Do not use for the outcome of an action the user just took; use Toast.',
    'Do not use for field validation; use the field errorMessage.',
  ],
} satisfies ComponentDoc<InlineAlertProps>;
