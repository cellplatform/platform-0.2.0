import { type t } from '../common';

/**
 * Converts a nested set of arrays into a flat single-level array.
 */
export function flatten<T>(list: any): T[] {
  if (!Array.isArray(list)) return list;

  const result: any = list.reduce((a, b) => {
    const value: any = Array.isArray(b) ? flatten(b) : b;
    return a.concat(value);
  }, []);

  return result as T[];
}

/**
 * Ensures a value is an array.
 */
export function asArray<T>(input: T | T[]): T[] {
  return Array.isArray(input) ? input : [input];
}

/**
 * Filter an array with an asynchronous predicate.
 */
export async function asyncFilter<T>(list: T[], predicate: (value: T) => Promise<boolean>) {
  const results = await Promise.all(list.map(predicate));
  return list.filter((_, index) => results[index]);
}

/**
 * Extract a "page" sub-set from the given array of items.
 * @param list The array of items to paginate.
 * @param index The page number (1-based index).
 * @param limit The number of items per page.
 * @returns An array containing the items for the specified page.
 */
export function page<T>(list: T[] = [], index: t.Index, limit: number): T[] {
  index = Math.max(0, index);
  limit = Math.max(0, limit);
  const startIndex = index * limit;
  const endIndex = startIndex + limit;
  return list.slice(startIndex, endIndex);
}

/**
 * Checks if elements in [array-a] match the start of [array-b].
 *
 * @param a - The array whose elements need to match the start of arrayB.
 * @param b - The array to check against.
 * @returns true if the elements of arrayA match the start of arrayB, otherwise false.
 */
export function matchesStart<T>(a: T[] | undefined, b?: T[] | undefined): boolean {
  if (a === undefined || b === undefined) return false;
  if (a.length > b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
