import { type t } from './common';

export const Patches = {
  shared(e: t.DocChanged<t.WebrtcSyncDoc>) {
    const read = (action: 'put' | 'del') => {
      const key: keyof t.WebrtcSyncDoc = 'shared';
      const first = e.patches[0];
      if (first.action !== action) return;

      const uri = first.path[0] === key ? first.path[1] : undefined;
      const value = first.action === 'put' ? first.value : undefined;

      return uri ? { uri, value } : undefined;
    };
    const put = read('put');
    const del = read('del');
    return { put, del } as const;
  },
} as const;
