import type { ComponentDoc } from '../doc';
import type { LinkProps } from './Link';

export default {
  name: 'Link',
  status: 'experimental',
  summary: 'Navigates to another page or resource. Use Button for actions.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/link/',
  contract: 'DS-LINK',
  props: {
    href: 'Required destination. In-app routes go through the app RouterProvider (client-side navigation).',
    variant: 'inline (default) inside text; standalone for a link on its own line or in a list.',
    children: 'Visible text that describes the destination.',
    target: 'Use "_blank" only for external documentation; say so in the text ("opens in a new tab").',
    isDisabled: 'Keeps the text but removes navigation; prefer hiding unavailable destinations.',
  },
  do: ['Write link text that makes sense out of context ("View billing history").'],
  dont: ['Do not use a Link to run an action (delete, save); use Button.', 'Do not pass className or style.'],
} satisfies ComponentDoc<LinkProps>;
