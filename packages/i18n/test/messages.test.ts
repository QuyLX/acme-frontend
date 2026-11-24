import { describe, expect, test, vi } from 'vitest';
import { createRequestConfig, defaultLocale, isLocale, loadMessages, locales, missingKeys, resolveLocale, type Locale } from '../src/index';

// Synthetic catalogs.
const vi_ = { common: { save: 'Lưu', cancel: 'Hủy' }, tenants: { title: 'Khách hàng', empty: 'Chưa có khách hàng' } };
const en = { common: { save: 'Save', cancel: 'Cancel' }, tenants: { title: 'Tenants', empty: 'No tenants yet' } };

describe('locales', () => {
  test('vi and en, vi by default', () => {
    expect(locales).toEqual(['vi', 'en']);
    expect(defaultLocale).toBe('vi');
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(resolveLocale('fr')).toBe('vi');
    expect(resolveLocale(undefined)).toBe('vi');
  });
});

describe('missingKeys (AC-8)', () => {
  test('identical key sets report nothing', () => {
    expect(missingKeys({ vi: vi_, en })).toEqual([]);
  });

  test('a key present in vi but absent in en is reported for en', () => {
    expect(missingKeys({ vi: { ...vi_, users: { invite: 'Mời' } }, en })).toEqual([{ locale: 'en', key: 'users.invite' }]);
  });

  test('a key present in en but absent in vi is reported for vi', () => {
    const enWithExtra = { ...en, tenants: { ...en.tenants, delete: 'Delete tenant' } };
    expect(missingKeys({ vi: vi_, en: enWithExtra })).toEqual([{ locale: 'vi', key: 'tenants.delete' }]);
  });

  test('reports both directions at once, ordered by locale then key', () => {
    const viPartial = { common: { save: 'Lưu' }, tenants: vi_.tenants, onlyVi: { a: { b: 'x' } } };
    expect(missingKeys({ en, vi: viPartial })).toEqual([
      { locale: 'vi', key: 'common.cancel' },
      { locale: 'en', key: 'onlyVi.a.b' },
    ]);
  });

  test('a leaf in one locale and a namespace in another are different keys', () => {
    expect(missingKeys({ vi: { title: 'x' }, en: { title: { short: 'y' } } })).toEqual([
      { locale: 'vi', key: 'title.short' },
      { locale: 'en', key: 'title' },
    ]);
  });
});

describe('loadMessages and createRequestConfig (next-intl wiring)', () => {
  const catalogs: Record<Locale, typeof en> = { vi: vi_, en };
  const loader = vi.fn((locale: Locale) => Promise.resolve(catalogs[locale]));

  test('loadMessages falls back to the default locale for an unsupported locale', async () => {
    expect(await loadMessages('fr', loader)).toBe(vi_);
    expect(loader).toHaveBeenLastCalledWith('vi');
  });

  test('loadMessages rejects a catalog that is not an object', async () => {
    await expect(loadMessages('en', () => Promise.resolve(JSON.parse('"oops"')))).rejects.toThrow(/not an object/);
  });

  test('uses the [locale] segment', async () => {
    const config = await createRequestConfig(loader)({ requestLocale: Promise.resolve('en') });
    expect(config).toEqual({ locale: 'en', messages: en });
  });

  test('an explicit locale overrides the segment, and the time zone is passed through', async () => {
    const config = await createRequestConfig(loader, { timeZone: 'Asia/Ho_Chi_Minh' })({ locale: 'en', requestLocale: Promise.resolve('vi') });
    expect(config).toEqual({ locale: 'en', messages: en, timeZone: 'Asia/Ho_Chi_Minh' });
  });

  test('an unknown or missing segment resolves to vi', async () => {
    expect((await createRequestConfig(loader)({ requestLocale: Promise.resolve('unknown.txt') })).locale).toBe('vi');
    expect((await createRequestConfig(loader)({ requestLocale: Promise.resolve(undefined) })).locale).toBe('vi');
  });
});
