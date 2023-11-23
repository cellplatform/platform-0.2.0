import type { t } from './common';

export type StoreNetworkKind = 'BroadcastChannel' | 'Unknown';

/**
 * Store (a repository of documents).
 */
export type Store = t.Lifecycle & {
  readonly repo: t.Repo;
  readonly doc: t.DocStore;
};
