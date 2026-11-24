// Real-browser a11y lane (ds.story-interaction): axe with color contrast, which jsdom cannot compute, for every
// story in light and dark themes. Contrast is the part the jsdom lane and the token check cannot see together.
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, test } from 'vitest';
import { setTheme, stories, themes } from './stories';

describe.each(themes)('theme %s', (theme) => {
  test.each(stories)('$id has no axe violations, including color contrast', async ({ Story }) => {
    setTheme(theme);
    const { container, unmount } = render(<Story />);
    const result = await axe.run(container, { rules: { region: { enabled: false } } });
    unmount();
    expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
});
