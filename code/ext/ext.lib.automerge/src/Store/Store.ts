import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';
import { Is, type t } from './common';
import { StoreDoc } from './Store.Doc';

export type DocRefArgs<T> = { initial: t.DocChange<T>; uri?: t.AutomergeUrl };

/**
 * Manage an Automerge repo.
 */
export const Store = {
  init(repo?: t.Repo) {
    const store = repo ?? new Repo({ network: [] });

    const api = {
      repo: store,

      /**
       * Create a factory for docs.
       */
      async docType<T>(initial: t.DocChange<T>) {
        return (uri?: t.AutomergeUrl) => api.docRef<T>({ initial, uri });
      },

      /**
       * Find or create a new CRDT document from the repo.
       */
      async docRef<T>(args: DocRefArgs<T>) {
        const res = StoreDoc.getOrCreate<T>(store, args);
        await res.handle.whenReady();
        return res;
      },

      /**
       * Find or create a new CRDT document from the repo.
       */
      docRefSync<T>(args: DocRefArgs<T>) {},
    } as const;
    return api;
  },
} as const;
