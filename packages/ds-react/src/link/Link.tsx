'use client';
import { Link as RACLink, type LinkProps as RACLinkProps } from 'react-aria-components';
import type { ReactNode } from 'react';
import { cx, focusRing } from '../cx';

export type LinkVariant = 'inline' | 'standalone';

export interface LinkProps extends Omit<RACLinkProps, 'className' | 'style' | 'children' | 'render'> {
  /** Destination. Client-side routing is wired once per app with React Aria's RouterProvider. */
  href: string;
  /** `inline` (default) inside running text, always underlined; `standalone` for links on their own (medium weight, subtle underline). */
  variant?: LinkVariant;
  /** Visible link text describing the destination (not "click here"). */
  children: ReactNode;
}

const variants: Record<LinkVariant, string> = {
  inline: 'underline underline-offset-2 data-hovered:decoration-2',
  standalone: 'font-medium underline decoration-border-strong underline-offset-4 data-hovered:decoration-fg',
};

export function Link({ variant = 'inline', children, ...props }: LinkProps) {
  return (
    <RACLink
      {...props}
      className={cx(
        'cursor-pointer rounded-sm text-fg transition-colors ease-standard',
        'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled data-disabled:no-underline',
        focusRing,
        variants[variant],
      )}
    >
      {children}
    </RACLink>
  );
}
