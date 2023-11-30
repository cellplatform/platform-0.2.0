import { type t } from './common';

export const Wrangle = {
  /**
   * Filter a set of docs within the index.
   */
  filter(docs: t.RepoIndexDoc[], filter?: t.RepoIndexFilter) {
    return !filter ? docs : docs.filter((doc, index) => filter({ doc, index }, index));
  },
} as const;
