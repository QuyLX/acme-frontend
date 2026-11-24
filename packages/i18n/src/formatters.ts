// Locale-aware number and date formatting via Intl (FE §8: check `i18n.formatting`).
import type { Locale } from './locales';

/** Number and date formatting bound to one locale. */
export interface Formatters {
  /** Formats a number with the locale's grouping and decimal separators. */
  formatNumber(value: number | bigint, options?: Intl.NumberFormatOptions): string;
  /** Formats a date (Date, epoch milliseconds or ISO string) in the locale's date order; `dateStyle: 'short'` by default. */
  formatDate(value: Date | number | string, options?: Intl.DateTimeFormatOptions): string;
}

/** Options for {@link createFormatters}. */
export interface FormatterOptions {
  /** IANA time zone for dates; defaults to the runtime's. Pass the same zone as next-intl to avoid hydration drift. */
  timeZone?: string;
}

/** Creates {@link Formatters} for `locale`. Throws on an invalid date. */
export function createFormatters(locale: Locale, options: FormatterOptions = {}): Formatters {
  return {
    formatNumber: (value, numberOptions) => new Intl.NumberFormat(locale, numberOptions).format(value),
    formatDate: (value, dateOptions) => {
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) throw new RangeError(`@platform/i18n: invalid date ${JSON.stringify(String(value))}`);
      const timeZone = dateOptions?.timeZone ?? options.timeZone;
      // `dateStyle` cannot be combined with component options (year, month, …), so it is only the default.
      const hasComponents = Object.keys(dateOptions ?? {}).some((key) => key !== 'timeZone');
      const resolved: Intl.DateTimeFormatOptions = hasComponents ? { ...dateOptions } : { dateStyle: 'short' };
      if (timeZone) resolved.timeZone = timeZone;
      return new Intl.DateTimeFormat(locale, resolved).format(date);
    },
  };
}

/** Formatters for every supported locale, using the runtime time zone. */
export const formatters: Readonly<Record<Locale, Formatters>> = {
  vi: createFormatters('vi'),
  en: createFormatters('en'),
};
