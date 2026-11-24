import type { ComponentDoc } from '../doc';
import type { DialogProps } from './Dialog';

export default {
  name: 'Dialog',
  status: 'experimental',
  summary: 'Modal dialog that traps focus and returns it to the trigger on close.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  contract: 'DS-DIALOG',
  props: {
    title: 'Required; becomes the accessible name via aria-labelledby.',
    children: 'Content or a render function receiving close().',
    isOpen: 'Controlled open state; omit when wrapped in DialogTrigger.',
    onOpenChange: 'Called when the dialog requests to open or close.',
    isDismissable: 'Default true. Set false while a required decision is pending (disables outside click and Escape).',
  },
  do: ['Wrap in DialogTrigger with a Button so focus returns to the trigger.'],
  dont: ['Do not nest dialogs.', 'Do not use for destructive confirmation without the confirm pattern (not yet in the DS).'],
} satisfies ComponentDoc<DialogProps>;
