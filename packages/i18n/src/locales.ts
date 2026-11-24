// Supported locales (FE §4.1).

/** Supported locales, in report order. */
export const locales = ['vi', 'en'] as const;

/** A supported locale. */
export type Locale = (typeof locales)[number];

/** Locale used when a request carries no or an unsupported locale. */
export const defaultLocale: Locale = 'vi';

/** Whether `value` is a supported locale. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Returns `candidate` when it is supported, otherwise {@link defaultLocale}. */
export function resolveLocale(candidate: unknown): Locale {
  return isLocale(candidate) ? candidate : defaultLocale;
}
