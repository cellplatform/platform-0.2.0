import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';
import { Is, type t } from './common';

const repo = new Repo({
  network: [new BroadcastChannelNetworkAdapter()],
  storage: new IndexedDBStorageAdapter(),
});

/**
 * Manage an Automerge repo.
 */
export const Store = {
  repo,


  /**
   *
   */
  async docRef<T>(args: { initial: t.DocChange<T>; url?: t.AutomergeUrl }) {
    const { url = '' } = args;

    const createDoc = () => {
      const doc = repo.create<T>();
      doc.change((d: any) => args.initial(d));
      return doc;
    };

    const handle = Is.automergeUrl(url) ? repo.find<T>(url) : createDoc();
    const uri = handle.url;

    /**
     * API
     */
    const api: t.DocRefHandle<T> = {
      uri,
      handle,
      get current() {
        return handle.docSync();
      },
      change(fn) {
        handle.change((d: any) => fn(d));
      },
    } as const;

    await handle.whenReady();
    return api;
  },
} as const;
