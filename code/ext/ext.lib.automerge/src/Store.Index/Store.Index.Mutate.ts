import { type t } from './common';
import { Wrangle } from './u.Wrangle';

/**
 * Manages an index of documents within a repository.
 */
export const Mutate = {
  toggleShared(
    doc: t.RepoIndex,
    index: number,
    options: { value?: boolean; filter?: t.RepoIndexFilter } = {},
  ) {
    const docs = Wrangle.filter(doc.docs, options.filter);
    const item = docs[index];
    if (item) {
      const shared = wrangle.shared(item);
      const next = typeof options.value === 'boolean' ? options.value : !shared.current;
      shared.current = next;
    }
  },
} as const;

/**
 * Helpers
 */

const wrangle = {
  shared(item: t.RepoIndexDoc) {
    if (typeof item.shared !== 'object') item.shared = { current: false };
    return item.shared!;
  },
} as const;
