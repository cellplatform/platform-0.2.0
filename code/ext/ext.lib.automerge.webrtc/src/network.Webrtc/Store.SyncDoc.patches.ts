import { type t } from './common';

export const Patches = {
  shared(e: t.DocChanged<t.WebrtcEphemeral>) {
    const read = (action: 'put' | 'del') => {
      const first = e.patches[0];
      const path = first.path;
      const uri = first.action === action && path[0] === 'shared' ? path[1] : undefined;
      return uri as string;
    };
    const put = read('put');
    const del = read('del');
    return { put, del } as const;
  },
} as const;
