import { DEFAULTS, ObjectPath, type t } from './common';

type O = Record<string, unknown>;

/**
 * Helpers for resolving and mutating paths.
 */
export const Path = {
  /**
   * Factory for a resolver that reads path locations from the given abstract document.
   * This might be the root of a lens within a document.
   */
  resolver(path: t.CmdBarPaths = DEFAULTS.paths) {
    const resolve = ObjectPath.resolve;
    const api = {
      text: (d?: O) => resolve<string>(d, path.text) || '',
      tx: (d: O) => resolve<string>(d, path.tx) || '',
      doc(d: O): t.CmdBarLensObject {
        return {
          text: api.text(d),
          tx: api.tx(d),
        };
      },
    } as const;
    return api;
  },
} as const;
