import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { Radio, RadioGroup } from './RadioGroup';
import * as stories from './RadioGroup.stories';

describe('RadioGroup stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

function Sizes(props: { onChange?: (value: string) => void; isInvalid?: boolean }) {
  return (
    <RadioGroup label="Instance size" errorMessage="Choose an instance size." {...props}>
      <Radio value="small">Small</Radio>
      <Radio value="medium" isDisabled>Medium</Radio>
      <Radio value="large">Large</Radio>
    </RadioGroup>
  );
}

describe('RadioGroup contract DS-RADIOGROUP', () => {
  test('RAD-1: group is named by its label; Tab enters the group and arrow keys move the selection', async () => {
    const onChange = vi.fn();
    render(<Sizes onChange={onChange} />);
    expect(screen.getByRole('radiogroup', { name: 'Instance size' })).toBeTruthy();
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Small' }));
    await userEvent.keyboard('{ArrowDown}');
    expect((screen.getByRole('radio', { name: 'Large' }) as HTMLInputElement).checked).toBe(true);
    expect(onChange).toHaveBeenLastCalledWith('large');
  });

  test('RAD-2: a disabled option is skipped by arrow keys and cannot be chosen', async () => {
    const onChange = vi.fn();
    render(<Sizes onChange={onChange} />);
    const medium = screen.getByRole('radio', { name: 'Medium' }) as HTMLInputElement;
    expect(medium.disabled).toBe(true);
    await userEvent.click(screen.getByText('Medium'));
    expect(medium.checked).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('RAD-3: an invalid group is marked aria-invalid and described by its error message', () => {
    render(<Sizes isInvalid />);
    const group = screen.getByRole('radiogroup', { name: 'Instance size' });
    expect(group.getAttribute('aria-invalid')).toBe('true');
    const describedBy = (group.getAttribute('aria-describedby') ?? '').split(' ').map((id) => document.getElementById(id)?.textContent);
    expect(describedBy).toContain('Choose an instance size.');
  });
});
