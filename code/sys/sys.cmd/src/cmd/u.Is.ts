import type { t } from './common';
import { Patch } from './u.Patch';

/**
 * Flags: Event pattern inference.
 */
export const Is = {
  validState(input: any): input is t.CmdPathsObject {
    if (input === null || typeof input !== 'object') return false;
    const o = input as t.CmdPathsObject;
    return (
      typeof o.name === 'string' &&
      typeof o.params === 'object' &&
      typeof o.counter?.value === 'number' &&
      typeof o.tx === 'string'
    );
  },

  cmd<C extends t.CmdType>(input: t.Cmd<C> | any): input is t.Cmd<C> {
    if (input === null || typeof input !== 'object') return false;
    const o = input as t.Cmd<C>;
    return (
      typeof o.events === 'function' &&
      typeof o.invoke === 'function' &&
      typeof o.method === 'function'
    );
  },

  event: {
    countChange(paths: t.CmdPaths, patches: t.CmdPatch[]) {
      return patches.some((patch) => Patch.startsWith(patch, paths.counter));
    },
  },
} as const;
