import type { ComponentDoc } from '../doc';
import type { ShowToastOptions, ToastContent, ToastProps, ToastRegionProps } from './Toast';

export default {
  name: 'Toast',
  status: 'experimental',
  summary:
    'Brief, non-blocking notification of the outcome of an action. Create one queue per app shell with createToastQueue(), render <ToastRegion queue> once, and call showToast(queue, content).',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/',
  contract: 'DS-TOAST',
  props: {
    queue: 'ToastRegion: the queue from createToastQueue({ maxVisibleToasts }) (default 3 visible).',
    title: 'Content: short outcome, e.g. "Instance created".',
    description: 'Content: optional one-line detail.',
    tone: 'Content: neutral (default), success or danger. Danger toasts never auto-dismiss.',
    timeout: 'showToast option: auto-dismiss delay in ms (default 5000; ignored for danger).',
    onClose: 'showToast option: called when the toast closes (user or timeout).',
    toast: 'Toast: the queued toast; only needed when rendering a custom region.',
  },
  do: [
    'Confirm the outcome of a user action ("Instance created").',
    'Keep the region in the app shell so toasts survive route changes.',
    'Put anything the user must act on in an InlineAlert or Dialog instead.',
  ],
  dont: [
    'Do not put links or buttons other than Close in a toast; it may disappear before users reach it.',
    'Do not show a toast for validation errors; use the field errorMessage.',
  ],
} satisfies ComponentDoc<ToastProps & ToastRegionProps & ToastContent & ShowToastOptions>;
