import { composeStories } from '@storybook/react-vite';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { createToastQueue, showToast, ToastRegion } from './Toast';
import * as stories from './Toast.stories';

describe('Toast stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations (trigger and visible toast)`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
      await userEvent.click(screen.getByRole('button', { name: 'Show toast' }));
      const region = await screen.findByRole('region', { name: /notification/ });
      expect(await axeViolations(region)).toEqual([]);
      await userEvent.click(within(region).getByRole('button', { name: 'Close' }));
    });
  }
});

describe('Toast contract DS-TOAST', () => {
  test('TST-1: a shown toast appears in a notifications landmark and its title is announced through role alert', async () => {
    const queue = createToastQueue();
    render(<ToastRegion queue={queue} />);
    expect(screen.queryByRole('region')).toBeNull();
    act(() => void showToast(queue, { title: 'Instance created', description: 'web-01 is starting.', tone: 'success' }));
    const region = await screen.findByRole('region', { name: /notification/ });
    const toast = within(region).getByRole('alertdialog', { name: 'Instance created' });
    expect(within(toast).getByRole('alert').textContent).toContain('Instance created');
    expect(document.getElementById(toast.getAttribute('aria-describedby')!)?.textContent).toBe('web-01 is starting.');
  });

  test('TST-2: the close button is keyboard reachable, named "Close" and removes the toast', async () => {
    const queue = createToastQueue();
    const onClose = vi.fn();
    render(<ToastRegion queue={queue} />);
    act(() => void showToast(queue, { title: 'Changes saved' }, { onClose }));
    const close = await screen.findByRole('button', { name: 'Close' });
    close.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('TST-3: neutral and success toasts auto-dismiss after their timeout; danger toasts stay until closed', async () => {
    const queue = createToastQueue();
    render(<ToastRegion queue={queue} />);
    act(() => {
      showToast(queue, { title: 'Changes saved' }, { timeout: 50 });
      showToast(queue, { title: 'Delete failed', tone: 'danger' }, { timeout: 50 });
    });
    await screen.findByRole('alertdialog', { name: 'Changes saved' });
    await waitFor(() => expect(screen.queryByRole('alertdialog', { name: 'Changes saved' })).toBeNull(), { timeout: 1000 });
    expect(screen.getByRole('alertdialog', { name: 'Delete failed' })).toBeTruthy();
  });

  test('TST-4: at most maxVisibleToasts are shown; the rest wait in the queue', async () => {
    const queue = createToastQueue({ maxVisibleToasts: 2 });
    render(<ToastRegion queue={queue} />);
    act(() => {
      for (const title of ['One', 'Two', 'Three']) showToast(queue, { title, tone: 'danger' });
    });
    const region = await screen.findByRole('region', { name: /notification/ });
    expect(within(region).getAllByRole('alertdialog')).toHaveLength(2);
  });
});
