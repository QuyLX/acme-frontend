import type { ComponentDoc } from '../doc';
import type { PopoverProps } from './Popover';

export default {
  name: 'Popover',
  status: 'experimental',
  summary: 'Non-modal dialog anchored to a trigger, for short supplementary content or a small inline form. Wrap a Button and a Popover in DialogTrigger.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  contract: 'DS-POPOVER',
  props: {
    title: 'Required visible title; becomes the accessible name of the popover dialog.',
    children: 'Content, or a render function receiving close() for inline actions.',
    placement: 'bottom (default), top, start, end, or an aligned variant such as "bottom start".',
    isOpen: 'Controlled open state; omit when wrapped in DialogTrigger.',
    onOpenChange: 'Called when the popover requests to open or close.',
  },
  do: ['Keep content short: a definition, a details preview, or a form with one or two fields.', 'Wrap in DialogTrigger with a Button so focus returns to the trigger.'],
  dont: [
    'Do not use for plain hover hints; use Tooltip.',
    'Do not use for a list of actions; use Menu.',
    'Do not put a long or multi-step flow in a popover; use Dialog.',
  ],
} satisfies ComponentDoc<PopoverProps>;
