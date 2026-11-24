// jsdom lane of the a11y contract (FE §5.4). Color contrast is not computable in jsdom; it is covered by the
// token contrast check in @platform/ds-tokens and by the real-browser lane (Storybook addon-a11y).
import axe from 'axe-core';

export async function axeViolations(container: Element): Promise<string[]> {
  const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
  return result.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`);
}
