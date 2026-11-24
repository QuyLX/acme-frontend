import type { ComponentDoc } from '../doc';
import type { ButtonProps } from './Button';

export default {
  name: 'Button',
  status: 'experimental',
  summary: 'Triggers an action. Use Link for navigation.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  contract: 'DS-BUTTON',
  props: {
    variant: 'primary (default) for the main action of a view, secondary for other actions, danger for destructive actions, ghost for low-emphasis actions in toolbars.',
    size: 'md (default) or sm for dense tables and toolbars.',
    isPending: 'Shows a spinner and blocks presses while keeping focus; use while an action is in flight.',
    isDisabled: 'Prevents interaction. Prefer explaining why an action is unavailable over disabling silently.',
    onPress: 'Called on mouse, touch, keyboard and assistive-technology activation. Do not use onClick.',
    children: 'Visible label. Icon-only buttons must pass aria-label.',
  },
  do: ['One primary button per view section.', 'Use danger only together with a confirmation for irreversible actions.'],
  dont: ['Do not pass className or style; request a variant instead.', 'Do not use a Button to navigate to another page.'],
} satisfies ComponentDoc<ButtonProps>;
