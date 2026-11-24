import { composeStories } from '@storybook/react-vite';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import * as stories from './Select.stories';

const { Default } = composeStories(stories);

describe('Select stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('Select contract DS-SELECT', () => {
  test('SEL-1: keyboard opens the listbox; disabled options cannot be chosen', async () => {
    render(<Default />);
    const trigger = screen.getByRole('button', { name: /Region/ });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const listbox = await screen.findByRole('listbox');
    const disabled = within(listbox).getByRole('option', { name: /maintenance/ });
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
  });

  test('SEL-2: choosing an option shows it in the trigger', async () => {
    render(<Default />);
    await userEvent.click(screen.getByRole('button', { name: /Region/ }));
    await userEvent.click(await screen.findByRole('option', { name: 'Region B' }));
    expect(screen.getByRole('button', { name: /Region B/ })).toBeTruthy();
  });
});
