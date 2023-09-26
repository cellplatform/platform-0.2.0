import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';
import { Is, type t } from './common';

/**
 * Manage an Automerge repo.
 */
export const Store = {
  init() {
    const repo = new Repo({
      network: [new BroadcastChannelNetworkAdapter()],
      storage: new IndexedDBStorageAdapter(),
    });

    const api = {
      repo,

      /**
       * Create a factory for docs.
       */
      docType<T>(initial: t.DocHandle<T>) {
        //
        /**
         * TODO 🐷
         */
      },

      /**
       * Find or create a new CRDT document from the repo.
       */
      async docRef<T>(args: { initial: t.DocChange<T>; uri?: t.AutomergeUrl }) {
        const createDoc = () => {
          const doc = repo.create<T>();
          doc.change((d: any) => args.initial(d));
          return doc;
        };

        const handle = Is.automergeUrl(args.uri) ? repo.find<T>(args.uri) : createDoc();
        const uri = handle.url;
        const api: t.DocRefHandle<T> = {
          uri,
          handle,
          get current() {
            return handle.docSync();
          },
          change(fn) {
            handle.change((d: any) => fn(d));
          },
        };

        await handle.whenReady();
        return api;
      },
    } as const;
    return api;
  },
} as const;
