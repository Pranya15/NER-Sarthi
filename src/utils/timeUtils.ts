/**
 * Time values are stored as ISO-8601 strings in UTC.  Formatting is always
 * done in the browser's local timezone so an officer sees the time on their
 * device, not the server's timezone.
 */

export type TimestampInput = string | Date | number;

const INVALID_TIMESTAMP_LABEL = 'Time unavailable';

const asDate = (value: TimestampInput | null | undefined): Date | null => {
  if (value === null || value === undefined || value === '') return null;

  if (
    typeof value === 'string' &&
    (/^\d{1,2}:\d{2}(?::\d{2})?\s?(AM|PM)$/i.test(value.trim()) ||
      /^(?:\d+\s+(?:min|hour|day)s?\s+ago|just now)$/i.test(value.trim()) ||
      value.trim() === 'DEMO_RELATIVE')
  ) {
    return null;
  }

  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const clampToNow = (date: Date, now = new Date()): Date =>
  date.getTime() > now.getTime() ? new Date(now.getTime()) : date;

/** Return a valid, non-future ISO timestamp for operational/demo records. */
export function normalizeTimestamp(
  value: TimestampInput | null | undefined,
  fallbackMinutesAgo = 0,
  now = new Date(),
): string {
  const parsed = asDate(value ?? '');
  if (parsed) return clampToNow(parsed, now).toISOString();

  return new Date(now.getTime() - Math.max(0, fallbackMinutesAgo) * 60_000).toISOString();
}

/** Generate demo data relative to the time the data is loaded. */
export function createDemoTimestamp(minutesAgo: number, now = new Date()): string {
  return new Date(now.getTime() - Math.max(0, minutesAgo) * 60_000).toISOString();
}

export function formatLocalTime(value: TimestampInput | null | undefined): string {
  const date = asDate(value ?? '');
  if (!date) return INVALID_TIMESTAMP_LABEL;

  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatLocalDateTime(value: TimestampInput | null | undefined): string {
  const date = asDate(value ?? '');
  if (!date) return INVALID_TIMESTAMP_LABEL;

  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatTimeFriendly(
  dateInput: TimestampInput | null | undefined,
  now = new Date(),
): string {
  const parsed = asDate(dateInput ?? '');
  if (!parsed) return INVALID_TIMESTAMP_LABEL;

  const date = clampToNow(parsed, now);
  const safeDiffMs = Math.max(0, now.getTime() - date.getTime());
  const diffMins = Math.floor(safeDiffMs / 60_000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24 && now.toDateString() === date.toDateString()) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const inputDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (inputDay.getTime() === today.getTime()) return `Today, ${formatLocalTime(date)}`;
  if (inputDay.getTime() === yesterday.getTime()) return `Yesterday, ${formatLocalTime(date)}`;

  return date.toLocaleDateString([], {
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
