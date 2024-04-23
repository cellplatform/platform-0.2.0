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

  /**
   * Helper for shortening path URIs when displaying in debug UI.
   */
  shortenUris(mutate: t.CmdHostPathLens) {
    if (typeof mutate !== 'object' || mutate === null) return;
    if (!mutate.uri) return;
    const shorten = (value?: string) => (value ? `..${value.slice(-20)}` : '');
    mutate.uri.loaded = shorten(mutate.uri.loaded);
    mutate.uri.selected = shorten(mutate.uri.selected);
  },
} as const;
