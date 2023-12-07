import { type t } from './common';

export const Patches = {
  docs(e: t.DocChanged<t.WebrtcSyncDoc>) {
    const read = (action: 'insert' | 'del') => {
      const first = e.patches[0];
      const path = first.path;
      const key: keyof t.WebrtcSyncDoc = 'shared';
      const index = first.action === action && path[0] === key ? Number(path[1]) : -1;
      const doc = action === 'insert' ? e.patchInfo.after : e.patchInfo.before;
      const uri = index > -1 ? doc[key][index] : undefined;
      return index > -1 && uri ? { index, uri } : undefined;
    };
    const insert = read('insert');
    const remove = read('del');
    return { insert, remove } as const;
  },
} as const;
