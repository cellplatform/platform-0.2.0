import { type t } from './common';

type O = Record<string, unknown>;

/**
 * Helpers for working with arrays that represent object paths.
 */
export const ObjectPath = {
  /**
   * Prepend a path.
   */
  prepend(target: t.ObjectPath, prefix: t.ObjectPath) {
    return [...prefix, ...target];
  },

  /**
   * Read into an object and return the resulting value at the given path.
   */
  resolve<T>(root: unknown | unknown[], path: t.ObjectPath): T | undefined {
    if (typeof root !== 'object' || root === null) throw new Error('root is not an object');
    if (!path || path.length === 0) return root as T;

    let current: any = root;
    for (let key of path) {
      if (current[key] === undefined) return undefined;
      current = current[key];
    }

    return current;
  },

  /**
   * Return a strongly typed version of the resolve ƒ(🌳);
   */
  resolver<T>() {
    return (root: unknown | unknown[], path: t.ObjectPath): T | undefined => {
      return ObjectPath.resolve<T>(root, path);
    };
  },

  /**
   * Write a value to the given path on the root object.
   * If parts of the path do not exist, they are created as objects.
   */
  mutate<T>(root: unknown, path: t.ObjectPath, value: T): void {
    if (typeof root !== 'object' || root === null) throw new Error('root is not an object');
    if (!path || path.length === 0) throw new Error('path cannot be empty');

    let current: any = root;

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        // Last key in path → update the value.
        if (value === undefined) delete current[key];
        else current[key] = value;
      } else {
        // If the next part of the path doesn't exist, create it as an object.
        if (typeof current[key] !== 'object' || current[key] === null) current[key] = {};
        current = current[key];
      }
    });
  },
} as const;
