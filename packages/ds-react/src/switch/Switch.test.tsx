import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { Switch } from './Switch';
import * as stories from './Switch.stories';

describe('Switch stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('Switch contract DS-SWITCH', () => {
  test('SWT-1: exposed as a switch named by its label; label click and Space toggle it', async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>Auto-renew</Switch>);
    const input = screen.getByRole('switch', { name: 'Auto-renew' }) as HTMLInputElement;
    await userEvent.click(screen.getByText('Auto-renew'));
    expect(input.checked).toBe(true);
    await userEvent.keyboard(' ');
    expect(input.checked).toBe(false);
    expect(onChange.mock.calls).toEqual([[true], [false]]);
  });

  test('SWT-2: a disabled switch never changes state', async () => {
    const onChange = vi.fn();
    render(<Switch isDisabled onChange={onChange}>Auto-renew</Switch>);
    const input = screen.getByRole('switch', { name: 'Auto-renew' }) as HTMLInputElement;
    await userEvent.click(screen.getByText('Auto-renew'));
    expect(input.disabled).toBe(true);
    expect(input.checked).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });
});
