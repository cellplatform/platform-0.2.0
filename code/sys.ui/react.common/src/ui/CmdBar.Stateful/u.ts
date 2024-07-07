import { ObjectPath, type t } from './common';

/**
 * Prepend the set of paths with a given prefix.
 */
export function prepend(paths: t.CmdBarStatefulPaths, prefix: t.ObjectPath): t.CmdBarStatefulPaths {
  return {
    text: ObjectPath.prepend(paths.text, prefix),
  };
}
