import { type t } from './common';

export const Patches = {
  shared(e: t.DocChanged<t.WebrtcSyncDoc>) {
    const read = (action: 'put' | 'del') => {
      const first = e.patches[0];
      const path = first.path;
      const uri = first.action === action && path[0] === 'shared' ? String(path[1]) : undefined;
      const item = uri ? e.patchInfo.after.shared[uri] : undefined;
      return uri ? { uri, item } : undefined;
    };
    const put = read('put');
    const del = read('del');
    return { put, del } as const;
  },
} as const;
