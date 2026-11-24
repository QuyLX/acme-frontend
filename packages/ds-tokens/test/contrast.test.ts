// FE §5.2: semantic color pairs are checked for contrast automatically for every theme/mode.
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

type Pair = { fg: string; bg: string; minRatio: number };

const resolved: Record<string, Record<string, string>> = JSON.parse(readFileSync(new URL('../dist/resolved.json', import.meta.url), 'utf8'));
const { pairs }: { pairs: Pair[] } = JSON.parse(readFileSync(new URL('../tokens/contrast-pairs.json', import.meta.url), 'utf8'));

function luminance(hex: string): number {
  const rgb = hex.replace('#', '').slice(0, 6).match(/../g)!.map((c) => parseInt(c, 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

test('contrast formula matches WCAG reference values', () => {
  expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
});

for (const [theme, colors] of Object.entries(resolved)) {
  describe(`theme: ${theme}`, () => {
    for (const { fg, bg, minRatio } of pairs) {
      test(`${fg} on ${bg} ≥ ${minRatio}:1`, () => {
        expect(colors[fg], `token color.${fg} missing in ${theme}`).toBeDefined();
        expect(colors[bg], `token color.${bg} missing in ${theme}`).toBeDefined();
        expect(contrastRatio(colors[fg]!, colors[bg]!)).toBeGreaterThanOrEqual(minRatio);
      });
    }
  });
}
