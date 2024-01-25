import { type t } from './common';

type O = Record<string, unknown>;

/**
 * Helpers for working with arrays that represent object paths.
 */
export const JsonPath = {
  /**
   * Read into an object and return the resulting value at the given path.
   */
  resolve<T>(root: O, path: t.JsonPath): T | undefined {
    if (typeof root !== 'object' || root === null) throw new Error('root is not an object');
    if (path.length === 0) return root as T;

    let current: any = root;
    for (let key of path) {
      if (current[key] === undefined) return undefined;
      current = current[key];
    }

    return current;
  },
} as const;
