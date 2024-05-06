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
    return {
      uri: {
        loaded: (doc: O) => resolve<t.UriString>(doc, path.uri.loaded),
        selected: (doc: O) => resolve<t.UriString>(doc, path.uri.selected),
      },
      cmd: {
        text: (doc: O) => resolve<string>(doc, path.cmd.text),
        enter: (doc: O) => {
          const get = () => resolve<t.A.Counter>(doc, path.cmd.enter);
          if (!get()) ObjectPath.mutate(doc, path.cmd.enter, new A.Counter(0));
          return get();
        },
      },
    } as const;
  },
} as const;
