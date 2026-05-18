export type DatepickerFormat =
  | 'short'
  | 'medium'
  | 'long'
  | 'full'
  | 'iso'
  | Intl.DateTimeFormatOptions;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses an ISO `YYYY-MM-DD` string into a `Date` at local midnight,
 * sidestepping the UTC-vs-local parsing ambiguity of the `Date` constructor
 * when given a string.
 */
export function parseIsoDate(iso: string): Date | null {
  if (!ISO_DATE.test(iso)) {
    return null;
  }

  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formats an ISO date string (`YYYY-MM-DD`) for display, following the
 * datepicker `format` property. Non-ISO inputs are passed through
 * unchanged so partially-typed values aren't mangled.
 */
export function formatIsoDate(
  value: string,
  format: DatepickerFormat,
  locale: string | null,
): string {
  if (!value || format === 'iso') {
    return value;
  }

  const date = parseIsoDate(value);
  if (!date) {
    return value;
  }

  const options: Intl.DateTimeFormatOptions =
    typeof format === 'string'
      ? { dateStyle: format }
      : format;

  return new Intl.DateTimeFormat(locale ?? undefined, options).format(date);
}

/**
 * Formats a range value (`YYYY-MM-DD - YYYY-MM-DD`) by formatting each end
 * with `formatIsoDate` and rejoining them with the same separator.
 */
export function formatIsoDateRange(
  value: string,
  format: DatepickerFormat,
  locale: string | null,
): string {
  if (!value || format === 'iso') {
    return value;
  }

  const parts = value.split(' - ');
  if (parts.length !== 2) {
    return value;
  }

  const [start, end] = parts;
  return `${formatIsoDate(start, format, locale)} - ${formatIsoDate(end, format, locale)}`;
}
