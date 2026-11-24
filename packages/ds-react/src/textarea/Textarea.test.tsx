import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { Textarea } from './Textarea';
import * as stories from './Textarea.stories';

describe('Textarea stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('Textarea contract DS-TEXTAREA', () => {
  test('TXA-1: multi-line textbox named by its label and described by its description; Enter inserts a new line', async () => {
    const onChange = vi.fn();
    render(<Textarea label="Description" description="Up to 500 characters." onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Description' });
    expect(input.tagName).toBe('TEXTAREA');
    expect(document.getElementById(input.getAttribute('aria-describedby')!.split(' ')[0]!)?.textContent).toBe('Up to 500 characters.');
    await userEvent.type(input, 'line 1{Enter}line 2');
    expect(onChange).toHaveBeenLastCalledWith('line 1\nline 2');
  });

  test('TXA-2: invalid field exposes aria-invalid and shows the error message', () => {
    render(<Textarea label="Description" isInvalid errorMessage="Description is too long." />);
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Description is too long.')).toBeTruthy();
  });

  test('TXA-3: disabled field cannot be edited', async () => {
    const onChange = vi.fn();
    render(<Textarea label="Description" isDisabled defaultValue="fixed" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Description' }) as HTMLTextAreaElement;
    expect(input.disabled).toBe(true);
    await userEvent.type(input, 'more');
    expect(onChange).not.toHaveBeenCalled();
    expect(input.value).toBe('fixed');
  });
});
