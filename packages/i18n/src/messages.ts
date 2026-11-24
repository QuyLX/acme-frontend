// Message loading, next-intl request config and the missing-key report (FE-I18N-001, check `i18n.missing-keys`).
import type { AbstractIntlMessages } from 'next-intl';
import type { GetRequestConfigParams, RequestConfig } from 'next-intl/server';
import { locales, resolveLocale, type Locale } from './locales';

/** Loads the message catalog of one locale, e.g. `(locale) => import(\`../messages/${locale}.json\`).then((m) => m.default)`. */
export type MessageLoader = (locale: Locale) => Promise<AbstractIntlMessages>;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Loads the catalog for `locale` (unsupported values resolve to the default locale) and checks it is an object. */
export async function loadMessages(locale: string | undefined, loader: MessageLoader): Promise<AbstractIntlMessages> {
  const resolved = resolveLocale(locale);
  const messages: unknown = await loader(resolved);
  if (!isPlainObject(messages)) throw new Error(`@platform/i18n: messages for "${resolved}" are not an object`);
  return messages as AbstractIntlMessages;
}

/** Options for {@link createRequestConfig}. */
export interface RequestConfigOptions {
  /** IANA time zone passed to next-intl, so server and client format dates identically. */
  timeZone?: string;
}

/**
 * Builds the callback for next-intl's `getRequestConfig` in an app's `i18n/request.ts`:
 * `export default getRequestConfig(createRequestConfig(loader))`. The locale is the explicit override, else the
 * `[locale]` segment, else {@link defaultLocale} when absent or unsupported.
 */
export function createRequestConfig(
  loader: MessageLoader,
  options: RequestConfigOptions = {},
): (params: GetRequestConfigParams) => Promise<RequestConfig> {
  return async (params) => {
    const locale = resolveLocale(params.locale ?? (await params.requestLocale));
    const config: RequestConfig = { locale, messages: await loadMessages(locale, loader) };
    if (options.timeZone !== undefined) config.timeZone = options.timeZone;
    return config;
  };
}

const leafKeys = (messages: object, prefix = ''): string[] =>
  Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return isPlainObject(value) ? leafKeys(value, path) : [path];
  });

/** A message key (dot-separated path) that exists in another locale but not in `locale`. */
export interface MissingKey {
  locale: string;
  key: string;
}

/**
 * Compares nested message catalogs keyed by locale and returns, for every locale, the dot-separated keys that are
 * present in at least one other locale but missing from it. Ordered by locale (supported locales first) then key.
 */
export function missingKeys(messages: Record<string, object>): MissingKey[] {
  const keysByLocale = new Map(Object.entries(messages).map(([locale, catalog]) => [locale, new Set(leafKeys(catalog))]));
  const all = [...new Set([...keysByLocale.values()].flatMap((keys) => [...keys]))].sort();
  const order = (locale: string) => {
    const index = (locales as readonly string[]).indexOf(locale);
    return index === -1 ? locales.length : index;
  };
  const localeNames = [...keysByLocale.keys()].sort((a, b) => order(a) - order(b) || a.localeCompare(b));
  return localeNames.flatMap((locale) => all.filter((key) => !keysByLocale.get(locale)?.has(key)).map((key) => ({ locale, key })));
}
