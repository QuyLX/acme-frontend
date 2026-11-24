import { composeStories } from '@storybook/react-vite';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { Link } from './Link';
import * as stories from './Link.stories';

describe('Link stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('Link contract DS-LINK', () => {
  test('LNK-1: renders a native anchor with href, in the tab order, activated by Enter', async () => {
    const onPress = vi.fn();
    render(<Link href="#billing" onPress={onPress}>View billing history</Link>);
    const link = screen.getByRole('link', { name: 'View billing history' });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('#billing');
    await userEvent.tab();
    expect(document.activeElement).toBe(link);
    await userEvent.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('LNK-2: a disabled link is exposed as disabled and never navigates', async () => {
    const onPress = vi.fn();
    render(<Link href="#billing" isDisabled onPress={onPress}>View billing history</Link>);
    const link = screen.getByRole('link', { name: 'View billing history' });
    expect(link.getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(link);
    expect(onPress).not.toHaveBeenCalled();
    expect(fireEvent.click(link)).toBe(false); // default navigation is prevented
  });
});
