import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { ProgressBar } from './ProgressBar';
import * as stories from './ProgressBar.stories';

describe('ProgressBar stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('ProgressBar contract DS-PROGRESSBAR', () => {
  test('PRG-1: determinate bar is a progressbar named by its visible label exposing value, bounds and value text', () => {
    render(<ProgressBar label="Attaching volumes" minValue={0} maxValue={10} value={3} valueLabel="3 of 10 volumes" />);
    const bar = screen.getByRole('progressbar', { name: 'Attaching volumes' });
    expect(bar.getAttribute('aria-valuenow')).toBe('3');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('10');
    expect(bar.getAttribute('aria-valuetext')).toBe('3 of 10 volumes');
    expect(screen.getByText('3 of 10 volumes')).toBeTruthy();
  });

  test('PRG-2: indeterminate bar and spinner omit aria-valuenow but stay named', () => {
    render(
      <>
        <ProgressBar label="Preparing snapshot" isIndeterminate />
        <ProgressBar label="Loading instances" variant="spinner" value={50} />
      </>,
    );
    expect(screen.getByRole('progressbar', { name: 'Preparing snapshot' }).hasAttribute('aria-valuenow')).toBe(false);
    expect(screen.getByRole('progressbar', { name: 'Loading instances' }).hasAttribute('aria-valuenow')).toBe(false);
  });

  test('PRG-3: animations stop under prefers-reduced-motion', () => {
    const { container } = render(
      <>
        <ProgressBar label="Preparing snapshot" isIndeterminate />
        <ProgressBar label="Loading instances" variant="spinner" />
      </>,
    );
    const animated = container.querySelectorAll('[class*="animate-"]');
    expect(animated.length).toBe(2);
    for (const el of animated) expect(el.getAttribute('class')).toContain('motion-reduce:animate-none');
  });
});
