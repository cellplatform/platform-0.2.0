import { type t } from './common';

type O = Record<string, unknown>;

/**
 * Flag helpers.
 */
const Is = {
  path(input: any): input is t.ObjectPath {
    if (!Array.isArray(input)) return false;
    return input.every((item) => typeof item === 'string' || typeof item === 'number');
  },
} as const;

/**
 * Helpers for working with arrays that represent object paths.
 */
export const ObjectPath = {
  Is,

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
    Validate.rootParam(root);
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
   * Determine if the given path exists on the object.
   */
  exists(root: unknown, path: t.ObjectPath) {
    Validate.rootParam(root);
    Validate.pathParam(path);

    const pathToParent = path.length === 0 ? [] : path.slice(0, -1);
    const parent = ObjectPath.resolve(root, pathToParent);
    const field = path[path.length - 1];

    if (!(isObject(parent) || Array.isArray(parent))) return false;
    if (Array.isArray(parent) && typeof field === 'number') return true;
    if (isObject(parent)) return Object.keys(parent).includes(String(field));

    return false;
  },

  Mutate: {
    /**
     * Write a value to the given path on the root object.
     * If parts of the path do not exist, they are created as objects.
     */
    value<T>(root: unknown, path: t.ObjectPath, value: T): void {
      Validate.rootParam(root);
      Validate.pathParam(path);
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

    /**
     * Ensures there is an object at the given path.
     */
    ensure<T>(root: unknown | unknown[], path: t.ObjectPath, defaultValue: T): T {
      const existing = ObjectPath.resolve<T>(root, path);
      if (existing) return existing;
      ObjectPath.Mutate.value(root, path, defaultValue);
      return ObjectPath.resolve<T>(root, path)!;
    },

    /**
     * Performs a field deletion at the given path.
     */
    delete(root: unknown, path: t.ObjectPath) {
      ObjectPath.Mutate.value(root, path, undefined);
    },
  },
} as const;

/**
 * Helpers
 */

/**
 * Helpers
 */
function isObject(input: any): input is object {
  return input !== null && typeof input === 'object';
}

const Validate = {
  rootParam(root: unknown) {
    if (typeof root !== 'object' || root === null) throw new Error('root is not an object');
  },
  pathParam(path: t.ObjectPath) {
    if (!path || path.length === 0) throw new Error('path cannot be empty');
  },
} as const;
