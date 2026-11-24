// @platform/i18n — i18n wiring on next-intl: locales vi and en, message loading, missing-key report (FE §4.1, FE-I18N-001).
export { locales, defaultLocale, isLocale, resolveLocale } from './locales';
export type { Locale } from './locales';
export { loadMessages, createRequestConfig, missingKeys } from './messages';
export type { MessageLoader, MissingKey, RequestConfigOptions } from './messages';
export { createFormatters, formatters } from './formatters';
export type { Formatters, FormatterOptions } from './formatters';
