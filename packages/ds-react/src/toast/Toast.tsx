'use client';
import { IconClose } from '@platform/ds-icons';
// React Aria Components 1.22 ships toasts as UNSTABLE_* exports. They are wrapped here so a future rename only
// touches this file; the DS API (Toast, ToastRegion, createToastQueue, showToast) stays the same.
import {
  Button as RACButton,
  Text,
  UNSTABLE_Toast as RACToast,
  UNSTABLE_ToastContent as RACToastContent,
  UNSTABLE_ToastQueue as RACToastQueue,
  UNSTABLE_ToastRegion as RACToastRegion,
  type QueuedToast,
  type ToastProps as RACToastProps,
} from 'react-aria-components';
import { cx, focusRing } from '../cx';

export type ToastTone = 'neutral' | 'success' | 'danger';

/** What a toast shows. Stored in the queue. */
export interface ToastContent {
  /** Short outcome, e.g. "Instance created". */
  title: string;
  /** Optional one-line detail. */
  description?: string;
  /** Default `neutral`. `danger` toasts stay until closed. */
  tone?: ToastTone;
}

/** Queue of toasts shared by `ToastRegion` and the code that shows toasts (one per app shell). */
export type ToastQueue = RACToastQueue<ToastContent>;

export interface ShowToastOptions {
  /** Auto-dismiss after this many ms. Default 5000 for neutral/success; danger toasts never auto-dismiss. */
  timeout?: number;
  onClose?: () => void;
}

export interface ToastProps extends Omit<RACToastProps<ToastContent>, 'className' | 'style' | 'children' | 'render'> {
  /** The queued toast to render (provided by `ToastRegion`). */
  toast: QueuedToast<ToastContent>;
}

export interface ToastRegionProps {
  /** The app's toast queue from `createToastQueue()`. */
  queue: ToastQueue;
  /** Landmark name. Default: the localized notification count from React Aria ("1 notification."). */
  'aria-label'?: string;
}

const DEFAULT_TIMEOUT = 5000;

/** Creates the toast queue for an app shell. At most `maxVisibleToasts` (default 3) are shown at once. */
export function createToastQueue(options: { maxVisibleToasts?: number } = {}): ToastQueue {
  return new RACToastQueue<ToastContent>({ maxVisibleToasts: options.maxVisibleToasts ?? 3 });
}

/** Adds a toast with the DS timeout policy and returns its key (for `queue.close(key)`). */
export function showToast(queue: ToastQueue, content: ToastContent, options: ShowToastOptions = {}): string {
  const timeout = content.tone === 'danger' ? undefined : (options.timeout ?? DEFAULT_TIMEOUT);
  return queue.add(content, { timeout, onClose: options.onClose });
}

const tones: Record<ToastTone, string> = {
  neutral: 'border-border bg-surface text-fg',
  success: 'border-border bg-success-subtle text-success-text',
  danger: 'border-border bg-danger-subtle text-danger-text',
};

export function Toast({ toast, ...props }: ToastProps) {
  const tone = toast.content.tone ?? 'neutral';
  return (
    <RACToast
      {...props}
      toast={toast}
      className={cx('flex w-80 items-start gap-3 rounded-md border p-3 shadow-md', tones[tone], focusRing)}
    >
      <RACToastContent className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Text slot="title" className="text-sm font-semibold">
          {toast.content.title}
        </Text>
        {toast.content.description && (
          <Text slot="description" className="text-sm">
            {toast.content.description}
          </Text>
        )}
      </RACToastContent>
      <RACButton slot="close" className={cx('flex size-6 shrink-0 items-center justify-center rounded-sm data-hovered:bg-subtle', focusRing)}>
        <IconClose />
      </RACButton>
    </RACToast>
  );
}

export function ToastRegion({ queue, ...props }: ToastRegionProps) {
  return (
    <RACToastRegion {...props} queue={queue} className={cx('fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 rounded-md', focusRing)}>
      {({ toast }) => <Toast toast={toast} />}
    </RACToastRegion>
  );
}
