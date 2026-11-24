import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { Button } from './Button';
import * as stories from './Button.stories';

const composed = composeStories(stories);

describe('Button stories (examples are executable, jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composed)) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('Button contract DS-BUTTON', () => {
  test('BTN-1: activates with mouse and keyboard', async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Save</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onPress).toHaveBeenCalledTimes(3);
  });

  test('BTN-2: disabled button never calls onPress', async () => {
    const onPress = vi.fn();
    render(<Button isDisabled onPress={onPress}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('BTN-3: pending button blocks presses, stays focusable and announces progress', async () => {
    const onPress = vi.fn();
    render(<Button isPending onPress={onPress}>Save</Button>);
    const button = screen.getByRole('button', { name: /Save/ });
    await userEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
    button.focus();
    expect(document.activeElement).toBe(button);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeTruthy();
  });
});
