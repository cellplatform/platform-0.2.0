/**
 * Helper for perfoming array comparisons.
 * @param subject - The array whose elements are being examined.
 */
export function compare<T>(subject: T[]) {
  return {
    subject,
    startsWith: (match: T[]) => startsWith(subject, match),
  } as const;
}

/**
 * Helpers
 */

function startsWith<T>(a: T[] | undefined, b?: T[] | undefined): boolean {
  if (a === undefined || b === undefined) return false;
  if (a.length > b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
