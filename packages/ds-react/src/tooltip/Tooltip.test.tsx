import { composeStories } from '@storybook/react-vite';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import * as stories from './Tooltip.stories';

const { Default, OpenByDefault, DisabledTrigger } = composeStories(stories);

describe('Tooltip stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }

  test('open tooltip has no axe violations', async () => {
    render(<OpenByDefault />);
    expect(await axeViolations(await screen.findByRole('tooltip'))).toEqual([]);
  });
});

describe('Tooltip contract DS-TOOLTIP', () => {
  test('TIP-1: keyboard focus on the trigger shows the tooltip, which describes (not names) the trigger', async () => {
    render(<Default />);
    await userEvent.tab();
    const trigger = screen.getByRole('button', { name: 'Copy ID' });
    expect(document.activeElement).toBe(trigger);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.textContent).toContain('Copies the instance ID to the clipboard');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  test('TIP-2: Escape hides the tooltip and focus stays on the trigger', async () => {
    render(<Default />);
    await userEvent.tab();
    const trigger = screen.getByRole('button', { name: 'Copy ID' });
    await screen.findByRole('tooltip');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  test('TIP-3: a disabled tooltip trigger never shows the tooltip', async () => {
    render(<DisabledTrigger />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Copy ID' }));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
