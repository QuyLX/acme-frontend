import axe from 'axe-core';

/**
 * Axe violations of a rendered container. jsdom cannot compute color contrast, so `contrast: false` is the default
 * here; the real-browser lane (ds.story-interaction) covers contrast.
 */
export async function axeViolations(container: Element, o: { contrast?: boolean } = {}): Promise<string[]> {
  const result = await axe.run(container, { rules: { 'color-contrast': { enabled: o.contrast ?? false }, region: { enabled: false } } });
  return result.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`);
}
