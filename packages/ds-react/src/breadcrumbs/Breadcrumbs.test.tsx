import { composeStories } from '@storybook/react-vite';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import * as stories from './Breadcrumbs.stories';

const { Default } = composeStories(stories);

describe('Breadcrumbs stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('Breadcrumbs contract DS-BREADCRUMBS', () => {
  test('BRC-1: a navigation landmark named "Breadcrumbs" contains an ordered list of the trail', () => {
    render(<Default />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    const list = within(nav).getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Compute', 'Instances', 'web-01']);
  });

  test('BRC-2: ancestors are links with href; the last item is marked aria-current="page" and does not navigate', () => {
    render(<Default />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(within(nav).getByRole('link', { name: 'Instances' }).getAttribute('href')).toBe('#instances');
    const current = within(nav).getByText('web-01');
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(current.getAttribute('href')).toBeNull();
    expect(current.getAttribute('aria-disabled')).toBe('true');
  });

  test('BRC-3: separators are decorative and hidden from assistive technology', () => {
    const { container } = render(<Default />);
    const separators = container.querySelectorAll('svg');
    expect(separators).toHaveLength(2);
    for (const svg of separators) expect(svg.getAttribute('aria-hidden')).toBe('true');
  });
});
