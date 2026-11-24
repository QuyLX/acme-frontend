import type { ComponentDoc } from '../doc';
import type { TextareaProps } from './Textarea';

export default {
  name: 'Textarea',
  status: 'experimental',
  summary: 'Multi-line text input with label, description and validation message.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/',
  contract: 'DS-TEXTAREA',
  props: {
    placeholder: 'Example input shown while empty; never a substitute for the label.',
    label: 'Required visible label; never use placeholder as the label.',
    description: 'Help text, announced with the field (e.g. a length limit).',
    errorMessage: 'Shown when isInvalid is true or validation fails.',
    rows: 'Visible height in text rows: 3 (default), 5 or 8. The user can resize vertically.',
    isRequired: 'Marks the field required and enables native required validation.',
    isInvalid: 'Forces the invalid state, e.g. for server-side errors.',
    isDisabled: 'Prevents editing; the value is still shown.',
  },
  do: ['Use for free text that can span lines (descriptions, notes).', 'State length limits in the description.'],
  dont: ['Do not use for single-line values; use TextField.', 'Do not pass className or style.'],
} satisfies ComponentDoc<TextareaProps>;
