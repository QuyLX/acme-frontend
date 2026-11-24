import { composeStories } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import * as stories from './Badge.stories';

describe('Badge contract DS-BADGE', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`BDG-1 ${name}: has visible status text and no axe violations`, async () => {
      const { container } = render(<Story />);
      expect(container.textContent?.trim().length).toBeGreaterThan(0);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});
