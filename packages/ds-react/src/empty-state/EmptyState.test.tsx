import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { Button } from '../button/Button';
import { EmptyState } from './EmptyState';
import * as stories from './EmptyState.stories';

describe('EmptyState stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('EmptyState contract DS-EMPTYSTATE', () => {
  test('EMP-1: the title is a heading at the requested level (default 2); the illustration is decorative', () => {
    const { container, rerender } = render(<EmptyState title="No instances yet" />);
    expect(screen.getByRole('heading', { level: 2, name: 'No instances yet' })).toBeTruthy();
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    rerender(<EmptyState title="No instances yet" headingLevel={3} />);
    expect(screen.getByRole('heading', { level: 3, name: 'No instances yet' })).toBeTruthy();
  });

  test('EMP-2: the action slot renders after the text and is reachable and operable by keyboard', async () => {
    const onPress = vi.fn();
    render(<EmptyState title="No instances yet" description="Create one to get started." action={<Button onPress={onPress}>Create instance</Button>} />);
    await userEvent.tab();
    const action = screen.getByRole('button', { name: 'Create instance' });
    expect(document.activeElement).toBe(action);
    expect(screen.getByText('Create one to get started.').compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await userEvent.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
