import type { ComponentDoc } from '../doc';
import type { BadgeProps } from './Badge';

export default {
  name: 'Badge',
  status: 'experimental',
  summary: 'Non-interactive status label (resource state, health).',
  a11yPattern: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html',
  contract: 'DS-BADGE',
  props: {
    tone: 'neutral (default), info, success, warning or danger.',
    children: 'Status text; must convey the status without relying on color.',
  },
  do: ['Map backend states to tones in one place per module.'],
  dont: ['Do not make a Badge clickable.', 'Do not use color alone (an empty badge) to convey status.'],
} satisfies ComponentDoc<BadgeProps>;
