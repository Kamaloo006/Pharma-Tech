export function isStrictDateRangeValid(
  fromDate?: string | null,
  toDate?: string | null,
) {
  if (!fromDate || !toDate) return true;
  return toDate > fromDate;
}

export function sanitizeDateRange<T extends Record<string, any>>(
  filters: T,
  fromKey: keyof T,
  toKey: keyof T,
): T {
  const fromDate = filters[fromKey];
  const toDate = filters[toKey];

  if (isStrictDateRangeValid(fromDate, toDate)) {
    return filters;
  }

  return {
    ...filters,
    [toKey]: "",
  };
}
