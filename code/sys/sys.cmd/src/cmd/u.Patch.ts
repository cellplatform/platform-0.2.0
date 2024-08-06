import { Value, type t } from './common';

/**
 * Helpers for working with change patches.
 */
export const Patch = {
  startsWith(patch: t.CmdPatch, def: t.ObjectPath) {
    const path = Patch.path(patch);
    return !path ? false : Value.Array.compare(path).startsWith(def);
  },

  path(patch: t.CmdPatch): t.ObjectPath {
    if (!patch || typeof patch !== 'object' || patch === null) return [];
    if (Array.isArray(patch.path)) return patch.path;
    if (typeof patch.path !== 'string') return [];
    return patch.path.trim().split('/').filter(Boolean);
  },

  includesCountChange(patches: t.CmdPatch[], paths: t.CmdPaths) {
    return patches.some((patch) => Patch.isCountChange(patch, paths));
  },

  isCountChange(patch: t.CmdPatch, paths: t.CmdPaths) {
    return Patch.startsWith(patch, paths.counter);
  },
} as const;
