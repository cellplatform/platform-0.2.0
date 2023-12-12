import { A, type t } from './common';

export const Wrangle = {
  /**
   * Filter a set of docs within the index.
   */
  filter(docs: t.StoreIndexItem[], filter?: t.StoreIndexFilter) {
    return !filter ? docs : docs.filter((doc, index) => filter({ doc, index }, index));
  },

  /**
   * The shared object (or default) on an index item.
   */
  shared(item: t.StoreIndexItem) {
    if (typeof item.shared !== 'object') {
      item.shared = { current: false, version: new A.Counter(0) };
    }
    return item.shared!;
  },
} as const;
