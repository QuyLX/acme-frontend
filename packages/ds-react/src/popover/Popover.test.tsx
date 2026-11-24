import { composeStories } from '@storybook/react-vite';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import * as stories from './Popover.stories';

const { Default, WithActions } = composeStories(stories);

describe('Popover stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations (closed and open)`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
      await userEvent.click(screen.getByRole('button', { name: 'Billing details' }));
      expect(await axeViolations(await screen.findByRole('dialog'))).toEqual([]);
    });
  }
});

describe('Popover contract DS-POPOVER', () => {
  test('POP-1: the trigger exposes aria-expanded; opening moves focus into a dialog named by its title', async () => {
    render(<Default />);
    const trigger = screen.getByRole('button', { name: 'Billing details' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Billing period' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  test('POP-2: Escape closes the popover and returns focus to the trigger', async () => {
    render(<Default />);
    const trigger = screen.getByRole('button', { name: 'Billing details' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  test('POP-3: an outside click closes the popover; close() from content closes it too', async () => {
    render(<WithActions />);
    const trigger = screen.getByRole('button', { name: 'Billing details' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog', { name: 'Stop instance?' });
    await userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
