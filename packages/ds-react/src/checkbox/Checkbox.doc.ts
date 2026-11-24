import type { ComponentDoc } from '../doc';
import type { CheckboxProps } from './Checkbox';

export default {
  name: 'Checkbox',
  status: 'experimental',
  summary: 'Binary or indeterminate choice with a visible label.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/',
  contract: 'DS-CHECKBOX',
  props: {
    children: 'Visible label; clicking it toggles the checkbox.',
    isSelected: 'Controlled checked state.',
    isIndeterminate: 'Mixed state, e.g. "select all" with a partial selection.',
    onChange: 'Called with the new checked state.',
  },
  do: ['Use for options that take effect on submit.'],
  dont: ['Do not use for an immediate on/off setting; use a switch (not yet in the DS).'],
} satisfies ComponentDoc<CheckboxProps>;
