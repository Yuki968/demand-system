const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function todayDateOnly() {
  return parseDateOnly(formatDate(new Date()) ?? "");
}

export function parseDateOnly(value: string | Date | null | undefined) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  if (!DATE_PATTERN.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDate(value: Date | null | undefined) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidDateOnly(value: string | null | undefined) {
  return Boolean(value && DATE_PATTERN.test(value) && parseDateOnly(value));
}

export function daysInclusive(
  startValue: string | Date | null | undefined,
  endValue: string | Date | null | undefined,
) {
  const start = parseDateOnly(startValue);
  const end = parseDateOnly(endValue);

  if (!start || !end) {
    return null;
  }

  return Math.floor((end.getTime() - start.getTime()) / DAY_IN_MS) + 1;
}

export function compareDateOnly(
  leftValue: string | Date | null | undefined,
  rightValue: string | Date | null | undefined,
) {
  const left = parseDateOnly(leftValue);
  const right = parseDateOnly(rightValue);

  if (!left || !right) {
    return 0;
  }

  return left.getTime() - right.getTime();
}

export function coerceDateOnly(
  preferredValue: string | Date | null | undefined,
  fallbackValue: string | Date | null | undefined,
) {
  return parseDateOnly(preferredValue) ?? parseDateOnly(fallbackValue);
}

