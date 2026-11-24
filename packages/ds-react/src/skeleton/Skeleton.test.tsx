import { composeStories } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { Skeleton } from './Skeleton';
import * as stories from './Skeleton.stories';

describe('Skeleton stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('Skeleton contract DS-SKELETON', () => {
  test.each(['text', 'block', 'circle'] as const)('SKL-1: shape %s is hidden from assistive technology and not focusable', (shape) => {
    const { container } = render(<Skeleton shape={shape} lines={3} />);
    const root = container.firstElementChild!;
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.textContent).toBe('');
    expect(root.querySelector('a, button, input, select, textarea, [tabindex]')).toBeNull();
  });

  test('SKL-2: every animated element stops animating under prefers-reduced-motion', () => {
    const { container } = render(
      <>
        <Skeleton lines={3} />
        <Skeleton shape="block" />
        <Skeleton shape="circle" />
      </>,
    );
    const animated = container.querySelectorAll('.animate-pulse');
    expect(animated.length).toBe(5);
    for (const el of animated) expect(el.classList.contains('motion-reduce:animate-none')).toBe(true);
  });

  test('SKL-3: text skeletons render the requested number of lines', () => {
    const { container } = render(<Skeleton lines={4} />);
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(4);
  });
});
