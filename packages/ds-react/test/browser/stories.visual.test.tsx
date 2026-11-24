// Visual regression lane (visual.stories, D-21): one screenshot per story and theme. Baselines live next to this
// file under __screenshots__ with a platform suffix; updating them needs a code owner (FE-TEST-002).
import { render } from '@testing-library/react';
import { page } from 'vitest/browser';
import { beforeAll, describe, expect, test } from 'vitest';
import { setTheme, stories, themes } from './stories';

beforeAll(() => {
  // Freeze motion and pointer state so screenshots are deterministic: without this, a cursor resting over the
  // rendered story flips hover-only styles (found 2026-11-24: Table-Sortable and Tooltip were flaky).
  const freeze = document.createElement('style');
  freeze.textContent =
    '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' +
    '[data-visual-root],[data-visual-root] *{pointer-events:none!important}';
  document.head.append(freeze);
});

describe.each(themes)('theme %s', (theme) => {
  test.each(stories)('$id matches its baseline', async ({ id, Story }) => {
    setTheme(theme);
    const { container, unmount } = render(<div data-visual-root className="inline-block p-4 bg-canvas"><Story /></div>);
    await expect.element(page.elementLocator(container.firstElementChild!)).toMatchScreenshot(`${id}-${theme}`);
    unmount();
  });
});
