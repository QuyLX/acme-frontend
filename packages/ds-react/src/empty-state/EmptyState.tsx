import { IconEmpty } from '@platform/ds-icons';
import type { ReactNode } from 'react';

export type EmptyStateHeadingLevel = 2 | 3 | 4;

export interface EmptyStateProps {
  /** What is empty and why, e.g. "No instances yet". Rendered as a heading. */
  title: string;
  /** Optional explanation or next step. */
  description?: string;
  /** Optional action slot, usually one primary Button or a Link. */
  action?: ReactNode;
  /** Heading level that fits the page outline. Default 2. */
  headingLevel?: EmptyStateHeadingLevel;
}

export function EmptyState({ title, description, action, headingLevel = 2 }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <IconEmpty size="xl" weight="light" tone="muted" placement="stacked" />
      <Heading className="text-md font-semibold text-fg">{title}</Heading>
      {description && <p className="max-w-md text-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-2 flex gap-2">{action}</div>}
    </div>
  );
}
