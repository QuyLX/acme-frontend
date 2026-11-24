import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { NumberField } from './NumberField';
import * as stories from './NumberField.stories';

describe('NumberField stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('NumberField contract DS-NUMBERFIELD', () => {
  test('NUM-1: input is named by its label; ArrowUp/ArrowDown step the value and stop at the bounds', async () => {
    const onChange = vi.fn();
    render(<NumberField label="Instance count" defaultValue={9} minValue={1} maxValue={10} onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Instance count' }) as HTMLInputElement;
    input.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(input.value).toBe('10');
    await userEvent.keyboard('{ArrowUp}');
    expect(input.value).toBe('10');
    await userEvent.keyboard('{ArrowDown}');
    expect(input.value).toBe('9');
    expect(onChange.mock.calls).toEqual([[10], [9]]);
  });

  test('NUM-2: step buttons are named after the field and disabled at the bounds', async () => {
    render(<NumberField label="Instance count" defaultValue={1} minValue={1} maxValue={10} />);
    const decrement = screen.getByRole('button', { name: 'Decrease Instance count' }) as HTMLButtonElement;
    const increment = screen.getByRole('button', { name: 'Increase Instance count' }) as HTMLButtonElement;
    expect(decrement.disabled).toBe(true);
    await userEvent.click(increment);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('2');
    expect(decrement.disabled).toBe(false);
  });

  test('NUM-3: typed values outside the range are clamped on blur', async () => {
    const onChange = vi.fn();
    render(<NumberField label="Instance count" defaultValue={2} minValue={1} maxValue={10} onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Instance count' }) as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, '25');
    await userEvent.tab();
    expect(input.value).toBe('10');
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  test('NUM-4: a disabled field cannot be edited or stepped', async () => {
    const onChange = vi.fn();
    render(<NumberField label="Instance count" defaultValue={2} isDisabled onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Instance count' }) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    await userEvent.click(screen.getByRole('button', { name: 'Increase Instance count' }));
    expect(input.value).toBe('2');
    expect(onChange).not.toHaveBeenCalled();
  });
});
