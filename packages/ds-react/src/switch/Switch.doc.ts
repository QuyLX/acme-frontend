import type { ComponentDoc } from '../doc';
import type { SwitchProps } from './Switch';

export default {
  name: 'Switch',
  status: 'experimental',
  summary: 'On/off setting that takes effect immediately.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/',
  contract: 'DS-SWITCH',
  props: {
    children: 'Visible label naming the setting; clicking it toggles the switch.',
    isSelected: 'Controlled on/off state.',
    defaultSelected: 'Initial state when uncontrolled.',
    onChange: 'Called with the new state; apply the setting immediately.',
    isDisabled: 'Prevents toggling. Explain nearby why the setting is locked.',
  },
  do: ['Use for settings that apply immediately (no Save button).', 'Name the setting, not the state ("Auto-renew", not "On").'],
  dont: ['Do not use inside a form that is applied on submit; use Checkbox.', 'Do not pass className or style.'],
} satisfies ComponentDoc<SwitchProps>;
