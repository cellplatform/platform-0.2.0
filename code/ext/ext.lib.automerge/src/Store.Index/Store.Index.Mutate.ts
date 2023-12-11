import { type t } from './common';
import { Wrangle } from './u.Wrangle';

/**
 * Manages an index of documents within a repository.
 */
export const Mutate = {
  toggleShared(doc: t.StoreIndexDocItem, options: { shared?: boolean } = {}) {
    const shared = Wrangle.shared(doc);
    const next = typeof options.shared === 'boolean' ? options.shared : !shared.current;
    if (next !== shared.current) {
      shared.current = next;
      shared.version.increment(1);
    }
    return shared;
  },
} as const;
