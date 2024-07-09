import { DEFAULTS, ObjectPath, type t } from './common';

/**
 * Path helpers for the <CmdBar>
 */
export const Path = {
  /**
   * Prepend the set of paths with a given prefix.
   */
  prepend(prefix: t.ObjectPath, paths: t.CmdBarPaths = DEFAULTS.paths): t.CmdBarPaths {
    const prepend = ObjectPath.prepend;
    return {
      text: prepend(paths.text, prefix),
      cmd: prepend(paths.cmd, prefix),
    };
  },
} as const;
