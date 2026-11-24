import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { Checkbox } from './Checkbox';
import * as stories from './Checkbox.stories';

describe('Checkbox stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('Checkbox contract DS-CHECKBOX', () => {
  test('CB-1: label click and Space toggle the state', async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Enable monitoring</Checkbox>);
    await userEvent.click(screen.getByText('Enable monitoring'));
    await userEvent.keyboard(' ');
    expect(onChange.mock.calls).toEqual([[true], [false]]);
  });

  test('CB-2: indeterminate is exposed as aria-checked="mixed"-equivalent state', () => {
    render(<Checkbox isIndeterminate>Select all</Checkbox>);
    const input = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });
});
