import { type t } from './common';

const KEY_SYS: keyof t.CrdtShared = 'sys';
const KEY_DOCS: keyof t.CrdtShared['sys'] = 'docs';

export const Patches = {
  shared(e: t.DocChanged<t.CrdtShared>) {
    const first = e.patches[0];
    if (first.action !== 'put') return;

    const path = first.path;
    const uri = path[0] === KEY_SYS && path[1] === KEY_DOCS ? first.path[2] : undefined;
    if (!uri) return undefined;

    const item = e.patchInfo.after.sys.docs[uri];
    return {
      uri: String(uri),
      shared: item?.shared,
      version: item?.version,
    };
  },
} as const;
