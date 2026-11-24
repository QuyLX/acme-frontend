import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { TextField } from './TextField';
import * as stories from './TextField.stories';

describe('TextField stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('TextField contract DS-TEXTFIELD', () => {
  test('TF-1: input is named by its label and described by its description', () => {
    render(<TextField label="Instance name" description="Lowercase only" />);
    const input = screen.getByRole('textbox', { name: 'Instance name' });
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
    expect(document.getElementById(input.getAttribute('aria-describedby')!.split(' ')[0]!)?.textContent).toBe('Lowercase only');
  });

  test('TF-2: invalid field exposes aria-invalid and shows the error message', () => {
    render(<TextField label="Name" isInvalid errorMessage="Name is already taken." />);
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Name is already taken.')).toBeTruthy();
  });
});
