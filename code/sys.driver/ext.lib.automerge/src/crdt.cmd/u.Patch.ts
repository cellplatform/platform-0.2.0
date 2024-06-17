import { Value, type t } from './common';

/**
 * Helpers for working with change patches.
 */
export const Patch = {
  startsWith(patch: t.Patch, def: t.ObjectPath) {
    const path = patch?.path;
    return !path ? false : Value.Array.compare(path).startsWith(def);
  },
} as const;
