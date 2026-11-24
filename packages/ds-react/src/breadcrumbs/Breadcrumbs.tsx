'use client';
import { IconChevronRight } from '@platform/ds-icons';
import {
  Breadcrumb as RACBreadcrumb,
  Breadcrumbs as RACBreadcrumbs,
  Link as RACLink,
  type BreadcrumbProps as RACBreadcrumbProps,
  type BreadcrumbsProps as RACBreadcrumbsProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cx, focusRing } from '../cx';

export interface BreadcrumbsProps<T extends object = object> extends Omit<RACBreadcrumbsProps<T>, 'className' | 'style' | 'render' | 'aria-label'> {
  /** Name of the navigation landmark. Default "Breadcrumbs". */
  'aria-label'?: string;
}

export interface BreadcrumbProps extends Omit<RACBreadcrumbProps, 'className' | 'style' | 'children' | 'render'> {
  /** Destination of an ancestor page. Omit on the last (current) item. */
  href?: string;
  /** Visible page name. */
  children: ReactNode;
}

export function Breadcrumbs<T extends object = object>({ 'aria-label': ariaLabel = 'Breadcrumbs', ...props }: BreadcrumbsProps<T>) {
  return (
    <nav aria-label={ariaLabel}>
      <RACBreadcrumbs {...props} className="flex flex-wrap items-center gap-1 text-sm" />
    </nav>
  );
}

export function Breadcrumb({ href, children, ...props }: BreadcrumbProps) {
  return (
    <RACBreadcrumb {...props} className="flex items-center gap-1">
      {({ isCurrent }) => (
        <>
          <RACLink
            href={href}
            className={cx(
              'rounded-sm text-fg-muted underline-offset-2 data-hovered:text-fg data-hovered:underline',
              'data-current:font-medium data-current:text-fg data-current:no-underline',
              focusRing,
            )}
          >
            {children}
          </RACLink>
          {!isCurrent && (
            <IconChevronRight tone="muted" />
          )}
        </>
      )}
    </RACBreadcrumb>
  );
}
