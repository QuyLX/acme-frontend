import type { ComponentDoc } from '../doc';
import type { NumberFieldProps } from './NumberField';

export default {
  name: 'NumberField',
  status: 'experimental',
  summary: 'Numeric input with increment/decrement buttons, bounds, step and locale-aware formatting.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
  contract: 'DS-NUMBERFIELD',
  props: {
    label: 'Required visible label; include the unit when it is not in formatOptions ("Disk size (GB)").',
    description: 'Help text, e.g. the allowed range.',
    errorMessage: 'Shown when isInvalid is true or validation fails.',
    minValue: 'Lower bound; the decrement button is disabled at the bound and typed values are clamped on blur.',
    maxValue: 'Upper bound; the increment button is disabled at the bound and typed values are clamped on blur.',
    step: 'Increment for arrow keys and buttons; typed values snap to the step.',
    formatOptions: 'Intl.NumberFormat options (percent, currency, units). Formatting follows the locale.',
    value: 'Controlled value (number; NaN when empty).',
    onChange: 'Called with the parsed number on blur, Enter, arrow keys or button press.',
    isDisabled: 'Prevents editing and stepping.',
  },
  do: ['Use for quantities with a known range (instance count, disk size).', 'State the range in the description.'],
  dont: ['Do not use for identifiers that only contain digits (phone, account number); use TextField.', 'Do not pass className or style.'],
} satisfies ComponentDoc<NumberFieldProps>;
