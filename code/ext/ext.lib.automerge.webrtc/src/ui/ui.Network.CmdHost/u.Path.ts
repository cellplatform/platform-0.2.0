import { A, DEFAULTS, ObjectPath, type t } from './common';

type O = Record<string, unknown>;

/**
 * Helpers for resolving and mutating paths.
 */
export const CmdHostPath = {
  /**
   * Factory for a resolver that reads path locations from the given abstract document.
   * This might be the root of a lens within a document.
   */
  resolver(path: t.CmdHostPaths = DEFAULTS.paths) {
    const resolve = ObjectPath.resolve;
    const api = {
      uri: {
        loaded: (d: O) => resolve<t.UriString>(d, path.uri.loaded) || '',
        selected: (d: O) => resolve<t.UriString>(d, path.uri.selected) || '',
      },
      cmd: {
        text: (d: O) => resolve<string>(d, path.cmd.text) || '',
        invoked: (d: O) => {
          const get = () => resolve<t.A.Counter>(d, path.cmd.invoked);
          if (!get()) ObjectPath.mutate(d, path.cmd.invoked, new A.Counter(0));
          return get()!;
        },
      },
      doc(d: O): t.CmdHostDocObject {
        return {
          uri: { selected: api.uri.selected(d), loaded: api.uri.loaded(d) },
          cmd: { text: api.cmd.text(d), invoked: api.cmd.invoked(d).value ?? 0 },
        };
      },
    } as const;
    return api;
  },
} as const;
