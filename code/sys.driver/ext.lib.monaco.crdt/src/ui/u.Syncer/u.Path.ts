import { DEFAULTS, ObjectPath, Value, type t } from './common';

/**
 * Helpers for working with paths.
 */
export const PathUtil = {
  /**
   * Wrangle a valid set of paths for the editor from a variety of flexible inputs.
   */
  wrangle(input?: t.EditorPaths | t.ObjectPath): t.EditorPaths {
    const def = DEFAULTS.paths;
    if (!input) return def;
    if (Array.isArray(input)) return PathUtil.prepend(def, input);
    return typeof input === 'object' ? input : def;
  },

  /**
   * Prepend the given set of paths with the given prefix.
   */
  prepend(paths: t.EditorPaths, prefix: t.ObjectPath) {
    const prepend = (target: t.ObjectPath) => ObjectPath.prepend(target, prefix);
    return {
      text: prepend(paths.text),
      cmd: prepend(paths.cmd),
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

  /**
   * Matches
   */
  includesIdentity(patches: t.Patch[], options: { paths?: t.EditorPaths; identity?: string } = {}) {
    const paths = PathUtil.wrangle(options.paths);
    const identityPath = paths.identity;
    if (options.identity) identityPath.push(options.identity);
    return patches.some((p) => Value.Array.compare(p.path).startsWith(identityPath));
  },
} as const;
