import { isValidAutomergeUrl, Repo as AutomergeRepo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';
import { A, type t } from './common';

const repo = new AutomergeRepo({
  network: [new BroadcastChannelNetworkAdapter()],
  storage: new IndexedDBStorageAdapter(),
});

export const Store = {
  repo,

  async init(options: { docUrl?: t.AutomergeUrl } = {}) {
    const { docUrl = '' } = options;

    let handle: t.DocHandle<t.Doc> | undefined;

    const createDoc = () => {
      const doc = repo.create<t.Doc>();
      doc.change((d: any) => (d.count = new A.Counter())); // TEMP: <any> 🐷
      return doc;
    };

    handle = isValidAutomergeUrl(docUrl) ? repo.find<t.Doc>(docUrl) : createDoc();
    console.info('handle', handle);

    await handle.whenReady();
    console.info('ready');

    /**
     * API
     */
    return { repo, docUrl } as const;
  },
} as const;
