import { Value, type t } from './common';

/**
 * Flags: Event pattern inference.
 */
export const EventsIs = {
  countChange(paths: t.CmdPaths, patches: t.Patch[]) {
    return patches.some((patch) => startsWith(patch, paths.counter));
  },
} as const;

/**
 * Helpers
 */
function startsWith(patch: t.Patch, def: t.ObjectPath) {
  const path = patch?.path;
  return !path ? false : Value.Array.compare(path).startsWith(def);
}
