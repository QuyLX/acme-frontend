import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import * as stories from './Tabs.stories';

const { Default, WithDisabledTab } = composeStories(stories);

describe('Tabs stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('Tabs contract DS-TABS', () => {
  test('TAB-1: tab list is named; the selected tab controls a tabpanel labelled by that tab', () => {
    render(<Default />);
    screen.getByRole('tablist', { name: 'Instance details' });
    const tab = screen.getByRole('tab', { name: 'Overview' });
    expect(tab.getAttribute('aria-selected')).toBe('true');
    const panel = screen.getByRole('tabpanel', { name: 'Overview' });
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.textContent).toContain('CPU, memory and status');
  });

  test('TAB-2: Tab enters the selected tab only; arrow keys move and select (wrapping), showing the matching panel', async () => {
    render(<Default />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Overview' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Network' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel', { name: 'Network' })).toBeTruthy();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Monitoring' }));
  });

  test('TAB-3: a disabled tab is skipped by arrow keys and cannot be selected', async () => {
    render(<WithDisabledTab />);
    const monitoring = screen.getByRole('tab', { name: 'Monitoring' });
    expect(monitoring.getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(monitoring);
    expect(monitoring.getAttribute('aria-selected')).toBe('false');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Network' }));
  });

  test('TAB-4: from the selected tab, Tab moves focus into the panel', async () => {
    render(<Default />);
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('tabpanel', { name: 'Overview' }));
  });
});
