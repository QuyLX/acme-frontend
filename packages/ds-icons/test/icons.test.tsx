import { cleanup, render } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, test } from 'vitest';
import * as icons from '../src/index';

afterEach(() => cleanup());

const all = Object.entries(icons).filter(([name]) => name.startsWith('Icon')) as Array<[string, (p: icons.IconProps) => React.ReactNode]>;

describe.each(all)('%s', (_name, Icon) => {
  test('decorative by default: hidden from assistive technology', () => {
    const { container } = render(<>{Icon({})}</>);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
  test('with a label it is an image with that name and no axe violations', async () => {
    const { container, getByRole } = render(<>{Icon({ label: 'Status' })}</>);
    expect(getByRole('img', { name: 'Status' })).toBeTruthy();
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
