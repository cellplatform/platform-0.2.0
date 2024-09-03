import { ObjectPath, DEFAULTS, type t } from './common';

/**
 * Helpers for wrangling the {data} property object.
 */
export const Data = {
  documents(input?: t.InfoData, options: { paths?: t.InfoDataPaths } = {}): t.InfoDoc[] {
    if (!input) return [];
    const paths = options.paths ?? DEFAULTS.paths;
    const target = ObjectPath.resolve<t.InfoData['document']>(input, paths.document);
    const res = Array.isArray(target) ? target : ([target] as t.InfoDoc[]);
    return res.filter(Boolean);
  },
} as const;
