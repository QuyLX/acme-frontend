import type { ComponentDoc } from '../doc';
import type { TextFieldProps } from './TextField';

export default {
  name: 'TextField',
  status: 'experimental',
  summary: 'Single-line text input with label, description and validation message.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/',
  contract: 'DS-TEXTFIELD',
  props: {
    placeholder: 'Example input shown while empty; never a substitute for the label.',
    label: 'Required visible label; never use placeholder as the label.',
    description: 'Help text, announced with the field.',
    errorMessage: 'Shown when isInvalid is true or validation fails.',
    isRequired: 'Marks the field required and enables native required validation.',
    isInvalid: 'Forces the invalid state, e.g. for server-side errors.',
    validate: 'Client-side validation function returning an error string.',
  },
  do: ['Validate on the server too; client validation is a convenience.'],
  dont: ['Do not use placeholder text as the only label.', 'Do not pass className or style.'],
} satisfies ComponentDoc<TextFieldProps>;
