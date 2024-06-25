import type { t } from './common';

/**
 * A CRDT that represents an index of a store/repo.
 */
export type WebStoreIndex = t.StoreIndexState & {
  readonly db: t.StoreIndexDb;
};
