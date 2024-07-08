import { ObjectPath, type t } from './common';

/**
 * Prepend the set of paths with a given prefix.
 */
export function prepend(paths: t.CmdBarPaths, prefix: t.ObjectPath): t.CmdBarPaths {
  return {
    text: ObjectPath.prepend(paths.text, prefix),
  };
}
