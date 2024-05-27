import { type t } from './common';
import { Patch } from './u.Patch';

/**
 * Flags: Event pattern inference.
 */
export const EventsIs = {
  countChange(paths: t.CmdPaths, patches: t.Patch[]) {
    return patches.some((patch) => Patch.startsWith(patch, paths.counter));
  },
} as const;
