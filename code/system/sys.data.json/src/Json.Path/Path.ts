import { type t } from './common';

/**
 * Helpers for working with arrays that represent object paths.
 */
export const Path = {
  /**
   * Read into an object and return the resulting value at the given path.
   */
  resolve<T>(root: object | any[], path: t.JsonPath): T | undefined {
    if (typeof root !== 'object' || root === null) throw new Error('root is not an object');
    if (!path || path.length === 0) return root as T;

    let current: any = root;
    for (let key of path) {
      if (current[key] === undefined) return undefined;
      current = current[key];
    }

    return current;
  },
} as const;