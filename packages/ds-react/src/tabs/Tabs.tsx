'use client';
import {
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
  type TabListProps as RACTabListProps,
  type TabPanelProps as RACTabPanelProps,
  type TabProps as RACTabProps,
  type TabsProps as RACTabsProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cx, focusRing } from '../cx';

export interface TabsProps extends Omit<RACTabsProps, 'className' | 'style' | 'children' | 'render' | 'orientation'> {
  /** One `TabList` followed by one `TabPanel` per tab. */
  children: ReactNode;
}

export interface TabListProps<T extends object = object> extends Omit<RACTabListProps<T>, 'className' | 'style' | 'render' | 'aria-label'> {
  /** Required accessible name of the tab list, e.g. "Instance details". */
  'aria-label': string;
}

export interface TabProps extends Omit<RACTabProps, 'className' | 'style' | 'children' | 'render'> {
  /** Matches the `id` of its TabPanel. */
  id: string;
  /** Visible tab label. */
  children: ReactNode;
}

export interface TabPanelProps extends Omit<RACTabPanelProps, 'className' | 'style' | 'children' | 'render'> {
  /** Matches the `id` of its Tab. */
  id: string;
  children: ReactNode;
}

export function Tabs({ children, ...props }: TabsProps) {
  return (
    <RACTabs {...props} className="flex flex-col gap-4">
      {children}
    </RACTabs>
  );
}

export function TabList<T extends object = object>(props: TabListProps<T>) {
  return <RACTabList {...props} className="flex gap-1 border-b border-border" />;
}

export function Tab({ children, ...props }: TabProps) {
  return (
    <RACTab
      {...props}
      className={cx(
        'relative -mb-px cursor-default border-b-2 border-transparent px-3 py-2 text-sm font-medium text-fg-muted transition-colors ease-standard',
        'data-hovered:text-fg data-selected:border-accent data-selected:text-fg',
        'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
        focusRing,
        'rounded-t-sm',
      )}
    >
      {children}
    </RACTab>
  );
}

export function TabPanel({ children, ...props }: TabPanelProps) {
  return (
    <RACTabPanel {...props} className={cx('rounded-sm text-sm text-fg', focusRing)}>
      {children}
    </RACTabPanel>
  );
}
