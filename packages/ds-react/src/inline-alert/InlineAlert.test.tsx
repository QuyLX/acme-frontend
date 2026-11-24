import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { InlineAlert, type InlineAlertTone } from './InlineAlert';
import * as stories from './InlineAlert.stories';

describe('InlineAlert stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('InlineAlert contract DS-INLINEALERT', () => {
  test.each<[InlineAlertTone, string]>([
    ['danger', 'alert'],
    ['warning', 'alert'],
    ['info', 'status'],
    ['success', 'status'],
  ])('ALR-1: tone %s uses role %s', (tone, role) => {
    render(<InlineAlert tone={tone} title="Quota reached" />);
    expect(screen.getByRole(role).textContent).toContain('Quota reached');
  });

  test('ALR-2: the title and detail are visible text inside the live region; the icon is decorative', () => {
    render(
      <InlineAlert tone="danger" title="Instances could not be loaded">
        Reload the page.
      </InlineAlert>,
    );
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe('Instances could not be loaded' + 'Reload the page.');
    expect(alert.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
});
