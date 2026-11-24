import type { ComponentDoc } from '../doc';
import type { SkeletonProps } from './Skeleton';

export default {
  name: 'Skeleton',
  status: 'experimental',
  summary: 'Decorative placeholder that previews the layout of content while it loads. Hidden from assistive technology.',
  a11yPattern: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html',
  contract: 'DS-SKELETON',
  props: {
    shape: 'text (default), block or circle.',
    lines: 'Number of text lines, 1–5 (shape text only).',
  },
  do: [
    'Set aria-busy="true" on the region being loaded and remove it when content arrives.',
    'Mirror the real layout so content does not jump when it loads.',
  ],
  dont: [
    'Do not rely on a skeleton to tell screen-reader users that content is loading; it is aria-hidden. Use aria-busy or a ProgressBar.',
    'Do not show skeletons for more than a few seconds; switch to an error InlineAlert on failure.',
  ],
} satisfies ComponentDoc<SkeletonProps>;
