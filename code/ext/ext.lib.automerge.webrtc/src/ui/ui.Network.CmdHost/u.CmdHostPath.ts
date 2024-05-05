import { DEFAULTS, ObjectPath, type t } from './common';

type O = Record<string, unknown>;
const resolve = ObjectPath.resolve;

/**
 * Helpers for resolving and mutating paths.
 */
export const CmdHostPath = {
  /**
   * Factory for a resolver that reads path locations from the given abstract document.
   * This might be the root of a lens within a document.
   */
  resolver(path: t.CmdHostPaths = DEFAULTS.paths) {
    return {
      uri: {
        loaded: (doc: O) => resolve<t.UriString>(doc, path.uri.loaded),
        selected: (doc: O) => resolve<t.UriString>(doc, path.uri.selected),
      },
      cmd: {
        text: (doc: O) => resolve<string>(doc, path.cmd.text),
      },
    } as const;
  },
} as const;
