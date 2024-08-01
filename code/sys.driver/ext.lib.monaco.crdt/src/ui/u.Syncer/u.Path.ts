import { DEFAULTS, ObjectPath, type t } from './common';

/**
 * Helpers for working with paths.
 */
export const SyncerPath = {
  /**
   * Wrangle a valid set of paths for the editor from a variety of flexible inputs.
   */
  wrangle(input?: t.EditorPaths | t.ObjectPath): t.EditorPaths {
    const def = DEFAULTS.paths;
    if (!input) return def;
    if (Array.isArray(input)) return SyncerPath.prepend(def, input);
    return typeof input === 'object' ? input : def;
  },

  /**
   * Prepend the given set of paths with the given prefix.
   */
  prepend(paths: t.EditorPaths, prefix: t.ObjectPath) {
    const prepend = (target: t.ObjectPath) => ObjectPath.prepend(target, prefix);
    return {
      text: prepend(paths.text),
      identity: prepend(paths.identity),
    };
  },

  /**
   * Helpers for a specific identity.
   */
  identity(identity: string, paths: t.EditorPaths = DEFAULTS.paths) {
    type T = t.EditorIdentityState;
    const root = [...paths.identity, identity];
    const path = (suffix: keyof T): t.ObjectPath => [...root, suffix];
    return {
      root,
      selection: path('selection'),
    } as const;
  },
} as const;
