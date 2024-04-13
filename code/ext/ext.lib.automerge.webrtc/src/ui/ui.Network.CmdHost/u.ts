import { DEFAULTS, ObjectPath, type t } from './common';

type O = Record<string, unknown>;

export const resolver = (path: t.CmdHostPaths = DEFAULTS.paths) => {
  const resolve = ObjectPath.resolve;
  return {
    cmd: (doc: O) => resolve<string>(doc, path.cmd),
    uri: (doc: O) => resolve<t.UriString>(doc, path.uri),
    selected: (doc: O) => resolve<t.UriString>(doc, path.selected),
  } as const;
};
