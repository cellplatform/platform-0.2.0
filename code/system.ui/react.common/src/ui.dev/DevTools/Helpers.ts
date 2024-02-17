import { Link } from './Helpers.Link';
import { Theme } from './Helpers.Theme';

type O = Record<string, unknown>;

/**
 * Simple helpers useful when workling with the [DevTools].
 */
export const Helpers = {
  Link,
  Theme,

  /**
   * Toggle the value of a boolean {object} key.
   * WARNING:
   *    This manipulates the given object.
   *    Ensure an immutable-safe object is passed.
   */
  toggle<T extends O>(object: T, key: keyof T) {
    if (object === null || typeof object !== 'object') return false;

    const current = object[key];
    if (typeof current !== 'boolean' && current !== undefined) return false;

    const next = current === undefined ? true : !current;
    object[key] = next as T[keyof T];
    return next;
  },
} as const;
