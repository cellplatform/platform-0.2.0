import { type t, A } from './common';
import { Wrangle } from './u.Wrangle';

/**
 * Manages an index of documents within a repository.
 */
export const Mutate = {
  toggleShared(doc: t.StoreIndexDocItem, options: { value?: boolean } = {}) {
    const shared = Wrangle.shared(doc);
    const next = typeof options.value === 'boolean' ? options.value : !shared.current;
    if (next !== shared.current) {
      shared.current = next;
      shared.version.increment(1);
    }
    return shared;
  },
} as const;
