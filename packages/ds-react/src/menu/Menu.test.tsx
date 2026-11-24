import { composeStories } from '@storybook/react-vite';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Key } from 'react-aria-components';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { Button } from '../button/Button';
import { Menu, MenuItem, MenuTrigger } from './Menu';
import * as stories from './Menu.stories';

const { Default } = composeStories(stories);

function InstanceActions({ onAction }: { onAction?: (key: Key) => void }) {
  return (
    <MenuTrigger>
      <Button variant="secondary">Actions</Button>
      <Menu onAction={onAction} disabledKeys={['restart']}>
        <MenuItem id="start">Start</MenuItem>
        <MenuItem id="restart">Restart</MenuItem>
        <MenuItem id="delete" tone="danger">Delete</MenuItem>
      </Menu>
    </MenuTrigger>
  );
}

describe('Menu stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations (closed and open)`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      expect(await axeViolations(await screen.findByRole('menu'))).toEqual([]);
    });
  }
});

describe('Menu contract DS-MENU', () => {
  test('MNU-1: the trigger announces a menu popup; Enter opens it and focuses the first item', async () => {
    render(<Default />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(within(menu).getAllByRole('menuitem')[0]);
  });

  test('MNU-2: arrow keys move focus, skipping disabled items; Enter activates, closes and returns focus to the trigger', async () => {
    const onAction = vi.fn();
    render(<InstanceActions onAction={onAction} />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: 'Restart' }).getAttribute('aria-disabled')).toBe('true');
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(within(menu).getByRole('menuitem', { name: 'Delete' }));
    await userEvent.keyboard('{Enter}');
    expect(onAction.mock.calls.map((call) => call[0])).toEqual(['delete']);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  test('MNU-3: Escape closes the menu without an action and returns focus to the trigger', async () => {
    const onAction = vi.fn();
    render(<InstanceActions onAction={onAction} />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await userEvent.click(trigger);
    await screen.findByRole('menu');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(onAction).not.toHaveBeenCalled();
  });
});
