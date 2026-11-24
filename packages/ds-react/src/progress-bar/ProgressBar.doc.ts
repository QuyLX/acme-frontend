import type { ComponentDoc } from '../doc';
import type { ProgressBarProps } from './ProgressBar';

export default {
  name: 'ProgressBar',
  status: 'experimental',
  summary: 'Shows the progress of an operation: a determinate or indeterminate bar, or an indeterminate spinner for short waits.',
  a11yPattern: 'https://www.w3.org/TR/wai-aria-1.2/#progressbar',
  contract: 'DS-PROGRESSBAR',
  props: {
    label: 'Required visible label naming the operation ("Uploading image").',
    variant: 'bar (default) or spinner. The spinner is always indeterminate.',
    value: 'Current value between minValue (default 0) and maxValue (default 100).',
    minValue: 'Lower bound of value. Default 0.',
    maxValue: 'Upper bound of value. Default 100.',
    isIndeterminate: 'Bar only: progress is unknown; no value is announced.',
    formatOptions: 'Intl.NumberFormat options for the value text (default percent).',
    valueLabel: 'Custom value text, e.g. "3 of 10 volumes".',
  },
  do: [
    'Use the bar when progress can be measured; use the spinner for waits under a few seconds.',
    'Set aria-busy on the region whose content is loading.',
  ],
  dont: ['Do not use a spinner inside a Button; use Button isPending.', 'Do not use ProgressBar for quotas or usage meters (a meter is a different role).'],
} satisfies ComponentDoc<ProgressBarProps>;
