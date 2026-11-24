import type { ComponentDoc } from '../doc';
import type { RadioGroupProps } from './RadioGroup';

export default {
  name: 'RadioGroup',
  status: 'experimental',
  summary: 'Choose exactly one option from a small set of visible options. Children are Radio elements.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/',
  contract: 'DS-RADIOGROUP',
  props: {
    label: 'Required visible group label.',
    description: 'Help text below the options.',
    errorMessage: 'Shown when isInvalid is true or validation fails (e.g. isRequired with no choice).',
    children: 'Radio elements; each Radio has a `value` and a visible label as children.',
    value: 'Controlled selected value.',
    defaultValue: 'Initial selected value when uncontrolled.',
    onChange: 'Called with the selected Radio value.',
    orientation: 'vertical (default) or horizontal for 2–3 short options.',
    isDisabled: 'Disables every option; disable a single Radio with its own isDisabled.',
  },
  do: ['Use for 2–6 mutually exclusive options that should all be visible.', 'Preselect a safe default when one exists.'],
  dont: ['Do not use for more than about 6 options; use Select.', 'Do not use for an on/off setting; use Switch or Checkbox.'],
} satisfies ComponentDoc<RadioGroupProps>;
