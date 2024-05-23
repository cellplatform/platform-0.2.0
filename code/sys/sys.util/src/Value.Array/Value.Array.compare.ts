import { type t } from '../common';

/**
 * Helper for perfoming array comparisons.
 */
export function compare<T>(source: T[]) {
  return {
    source,
    startsWith(target: T[]) {
      return startsWith(source, target);
    },
  } as const;
}

/**
 * Helpers
 */

/**
 * Checks if elements in [array-a] match the start of [array-b].
 * @param a - The array whose elements need to match the start of arrayB.
 * @param b - The array to check against.
 * @returns true if the elements of arrayA match the start of arrayB, otherwise false.
 */
function startsWith<T>(a: T[] | undefined, b?: T[] | undefined): boolean {
  if (a === undefined || b === undefined) return false;
  if (a.length > b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
