/**
 * Helper for perfoming array comparisons.
 * @param subject - The array whose elements are being examined.
 */
export function compare<T>(subject: T[]) {
  return {
    subject,
    startsWith: (compare: T[]) => startsWith(subject, compare),
  } as const;
}

/**
 * Helpers
 */
function startsWith<T>(subject: T[], compare: T[]): boolean {
  if (compare.length > subject.length) return false;
  for (let i = 0; i < compare.length; i++) {
    if (compare[i] !== subject[i]) return false;
  }
  return true;
}
