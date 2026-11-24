import type { ComponentDoc } from '../doc';
import type { SelectProps } from './Select';

export default {
  name: 'Select',
  status: 'experimental',
  summary: 'Choose one option from a short, known list.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
  contract: 'DS-SELECT',
  props: {
    label: 'Required visible label.',
    options: 'Array of { id, label, isDisabled? }; id is the reported value.',
    description: 'Help text below the trigger.',
    errorMessage: 'Shown when invalid.',
    placeholder: 'Shown when nothing is selected (default "Select…").',
  },
  do: ['Use for 3–15 options; use a combobox (not yet in the DS) for long or searchable lists.'],
  dont: ['Do not use for navigation menus.', 'Do not pass className or style.'],
} satisfies ComponentDoc<SelectProps>;
