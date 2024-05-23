import { Value, type t } from './common';

export const EventsIs = {
  textChange(def: t.CmdBarPaths, patches: t.Patch[]) {
    return startsWith(patches[0].path, def.text);
  },

  txChange(def: t.CmdBarPaths, patches: t.Patch[]) {
    return startsWith(patches[0].path, def.tx);
  },
} as const;

/**
 * Helpers
 */
function startsWith(patch: t.ObjectPath = [], def: t.ObjectPath) {
  return Value.Array.compare(patch).startsWith(def);
}
