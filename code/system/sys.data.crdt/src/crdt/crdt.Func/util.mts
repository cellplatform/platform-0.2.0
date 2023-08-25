import { Automerge, CrdtIs, type t } from './common';

export const Util = {
  /**
   * Initialize a CRDT field.
   */
  field<P extends {}>(parent: P, key: keyof P): t.CrdtFuncData {
    if (CrdtIs.funcData(parent[key])) {
      return parent[key] as t.CrdtFuncData;
    }

    const data: t.CrdtFuncData = {
      count: new Automerge.Counter(),
      params: {},
    };

    (parent as any)[key] = data;
    return data;
  },
};
