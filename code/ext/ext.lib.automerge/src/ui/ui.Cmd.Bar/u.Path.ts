import { A, DEFAULTS, ObjectPath, type t } from './common';

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
      invoked: (d: O) => {
        const get = () => resolve<t.A.Counter>(d, path.invoked);
        if (!get()) ObjectPath.mutate(d, path.invoked, new A.Counter(0));
        return get()!;
      },
      doc(d: O): t.CmdBarDocObject {
        return {
          text: api.text(d),
          invoked: api.invoked(d).value ?? 0,
        };
      },
    } as const;
    return api;
  },
} as const;
