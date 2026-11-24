import type { ComponentDoc } from '../doc';
import type { TooltipProps } from './Tooltip';

export default {
  name: 'Tooltip',
  status: 'experimental',
  summary: 'Short text hint shown on hover and keyboard focus of a focusable trigger. Wrap the trigger and a Tooltip in TooltipTrigger.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/',
  contract: 'DS-TOOLTIP',
  props: {
    children: 'Plain hint text. It describes the trigger (aria-describedby); it never names it.',
    placement: 'top (default), bottom, start or end; flips automatically when there is no room.',
  },
  do: [
    'Give icon-only buttons an aria-label and repeat it in a tooltip for sighted mouse users.',
    'Use TooltipTrigger props `delay` and `closeDelay` only to match the platform default across a page.',
  ],
  dont: [
    'Do not put links, buttons or other interactive content in a tooltip; use Popover.',
    'Do not hide information that is needed to complete a task in a tooltip (touch users never see it).',
    'Do not attach a tooltip to a non-focusable element.',
  ],
} satisfies ComponentDoc<TooltipProps>;
