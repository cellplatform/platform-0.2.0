import { type t } from './common';
import { Patch } from './u.Patch';

/**
 * Flags: Event pattern inference.
 */
export const Is = {
  initialized(input: any): input is t.CmdLens {
    if (input === null || typeof input !== 'object') return false;
    const obj = input as t.CmdLens;
    return (
      typeof obj.name === 'string' &&
      typeof obj.params === 'object' &&
      typeof obj.counter?.value === 'number'
    );
    return false;
  },

  event: {
    countChange(paths: t.CmdPaths, patches: t.Patch[]) {
      return patches.some((patch) => Patch.startsWith(patch, paths.counter));
    },
  },
} as const;
