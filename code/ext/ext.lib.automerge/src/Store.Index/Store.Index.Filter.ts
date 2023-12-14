import { type t, Is } from './common';

/**
 * Filters on a store's [Index].
 */
export const Filter = {
  /**
   * Filter a set of docs within the index.
   */
  docs(docs: t.StoreIndexDoc[], filter?: t.StoreIndexFilter) {
    return !filter ? docs : docs.filter((doc, index) => filter({ doc, index }, index));
  },
} as const;

