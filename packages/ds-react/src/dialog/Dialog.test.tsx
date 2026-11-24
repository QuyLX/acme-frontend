import { composeStories } from '@storybook/react-vite';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import * as stories from './Dialog.stories';

const { Default, NotDismissable } = composeStories(stories);

describe('Dialog stories (jsdom a11y lane)', () => {
  test('open dialog has no axe violations', async () => {
    render(<Default />);
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    const dialog = await screen.findByRole('dialog');
    expect(await axeViolations(dialog)).toEqual([]);
  });
});

describe('Dialog contract DS-DIALOG', () => {
  test('DLG-1: named by its title, focus moves inside, Escape closes and focus returns to the trigger', async () => {
    render(<Default />);
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Rename instance' });
    expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger)); // focus is restored asynchronously
  });

  test('DLG-2: non-dismissable dialog ignores Escape', async () => {
    render(<NotDismissable />);
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
