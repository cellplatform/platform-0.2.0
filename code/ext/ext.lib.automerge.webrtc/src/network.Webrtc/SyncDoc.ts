import { Crdt, Doc, rx, type t } from './common';
import { Sync, type Action } from './SyncDoc.Sync';

/**
 * An ephemeral (non-visual) document used to sync
 * index and other shared state over network connections.
 */
export const SyncDoc = {
  Sync,

  /**
   * Get or create a SyncDoc from the given store.
   */
  async getOrCreate(store: t.Store, uri?: string) {
    return store.doc.getOrCreate<t.WebrtcSyncDoc>((d) => {
      const initial: t.DocMeta = {
        ...Doc.Meta.default,
        type: { name: 'crdt.webrtc.SyncDoc' },
        ephemeral: true,
      };
      Doc.Meta.ensure(d, initial);
      d.shared = {};
    }, uri);
  },

  /**
   * Setup a new ephemeral document manager for a store/peer.
   */
  async init(
    peer: t.PeerModel,
    store: t.Store,
    index: t.StoreIndex,
    options: { label?: string; uri?: string; fire?: (e: t.WebrtcStoreEvent) => void } = {},
  ) {
    const { label } = options;
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose$ } = life;

    /**
     * TODO 🐷
     * - persist / re-use the doc (??)
     */

    /**
     * Setup the CRDT document.
     */
    const doc = await SyncDoc.getOrCreate(store, options.uri);
    const events = doc.events(dispose$);
    const fireChange = (change: t.DocChanged<t.WebrtcSyncDoc>) => {
      options.fire?.({ type: 'crdt:webrtc/SyncDoc', payload: { change } });
    };

    /**
     * Event Listeners.
     */
    events.changed$.subscribe((change) => fireChange(change));
    SyncDoc.listenToIndex({ index, doc, label, dispose$ });
    Sync.all(index, doc);

    /**
     * API
     */
    return {
      kind: 'SyncDoc',
      store,
      index,
      doc,

      /**
       * Lifecycle
       */
      dispose$,
      get disposed() {
        return life.disposed;
      },
    } as const;
  },

  /**
   * Remove all ephemeral documents from the given repo-index.
   */
  purge(index: t.StoreIndex) {
    const purged: string[] = [];
    index.doc.change((d) => {
      const docs = Crdt.Data.array(d.docs);
      let i = -1;
      while (true) {
        i = d.docs.findIndex((item) => item.meta?.ephemeral);
        if (i < 0) break;
        purged.push(docs[i].uri);
        docs.deleteAt(i);
      }
    });
    return purged;
  },

  /**
   * Setup event listener for an [Index] and keep the [SyncDoc] in sync.
   */
  listenToIndex(args: {
    index: t.StoreIndex;
    doc: t.DocRefHandle<t.WebrtcSyncDoc>;
    dispose$?: t.UntilObservable;
    label?: string;
  }) {
    const { index, doc, dispose$ } = args;
    const events = index.events(dispose$);
    const change = (source: t.RepoIndexDoc, action?: Action) => {
      doc.change((d) => Sync.doc(source, d, action));
    };
    events.added$.subscribe((e) => change(e.item));
    events.shared$.subscribe((e) => change(e.item));
    events.renamed$.subscribe((e) => change(e.item));
    events.removed$.subscribe((e) => change(e.item, 'remove'));
  },
} as const;
