import { Cmd, type t } from './common';

/**
 * Flags: Event pattern inference.
 */
export const EventsIs = {
  textChange(paths: t.CmdBarPaths, patches: t.Patch[]) {
    return patches.some((patch) => Cmd.Patch.startsWith(patch, paths.text));
  },
} as const;
