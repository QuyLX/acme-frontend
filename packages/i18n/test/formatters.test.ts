import { describe, expect, test } from 'vitest';
import { createFormatters, formatters } from '../src/index';

const date = new Date(Date.UTC(2026, 10, 24, 12, 0, 0));
const vi = createFormatters('vi', { timeZone: 'UTC' });
const en = createFormatters('en', { timeZone: 'UTC' });

describe('formatters (i18n.formatting)', () => {
  test('numbers use each locale’s grouping and decimal separators', () => {
    expect(vi.formatNumber(1234567.89)).toBe('1.234.567,89');
    expect(en.formatNumber(1234567.89)).toBe('1,234,567.89');
  });

  test('currency follows the locale', () => {
    const vnd = { style: 'currency', currency: 'VND' } as const;
    expect(vi.formatNumber(1500000, vnd)).not.toBe(en.formatNumber(1500000, vnd));
    expect(vi.formatNumber(1500000, vnd)).toContain('1.500.000');
  });

  test('dates use each locale’s order', () => {
    expect(vi.formatDate(date)).toBe('24/11/26');
    expect(en.formatDate(date)).toBe('11/24/26');
  });

  test('component options replace the default style', () => {
    const long = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    expect(en.formatDate(date, long)).toBe('November 24, 2026');
    expect(vi.formatDate(date, long)).not.toBe(en.formatDate(date, long));
  });

  test('accepts ISO strings and epoch milliseconds, rejects invalid dates', () => {
    expect(en.formatDate('2026-11-24T12:00:00Z')).toBe(en.formatDate(date.getTime()));
    expect(() => en.formatDate('not a date')).toThrow(RangeError);
  });

  test('prebuilt formatters exist for every locale', () => {
    expect(formatters.vi.formatNumber(1000.5)).toBe('1.000,5');
    expect(formatters.en.formatNumber(1000.5)).toBe('1,000.5');
  });
});
