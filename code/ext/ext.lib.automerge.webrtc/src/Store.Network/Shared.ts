import { Mutate } from './Shared.Mutate';
import { Patches } from './Shared.Patches';
import { Sync } from './Shared.Sync';
import { listenToIndex } from './Shared.b.listenToIndex';
import { listenToShared } from './Shared.b.listenToShared';
import { Doc, UserAgent, rx, type t } from './common';

/**
 * An ephemeral (non-visual) document used to sync
 * index and other shared state over network connections.
 */
export const Shared = {
  Sync,
  Patches,
  Mutate,

  get type(): t.DocMetaType {
    const name: t.CrdtSharedState['kind'] = 'crdt.network.shared';
    return { name };
  },

  get meta(): t.DocMeta {
    const type = Shared.type;
    return { ...Doc.Meta.default, type, ephemeral: true };
  },

  /**
   * Get or create a [Shared] document type from the given store.
   */
  async getOrCreate(store: t.Store, uri?: string) {
    return store.doc.getOrCreate<t.CrdtShared>((d) => {
      Doc.Meta.ensure(d, Shared.meta);
      d.peers = {};
      d.docs = {};
    }, uri);
  },

  /**
   * Setup a new ephemeral document manager for a store/peer.
   */
  async init(
    peer: t.PeerModel,
    store: t.Store,
    index: t.StoreIndexState,
    options: { debugLabel?: string; uri?: string; fire?: (e: t.WebrtcStoreEvent) => void } = {},
  ) {
    const { debugLabel } = options;
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose$ } = life;

    /**
     * TODO 🐷
     * - persist / re-use the doc (??)
     */

    /**
     * Setup the "shared" CRDT syncing document.
     */
    const shared = await Shared.getOrCreate(store, options.uri);
    const events = shared.events(dispose$);
    const fireChange = (change: t.DocChanged<t.CrdtShared>) => {
      options.fire?.({
        type: 'crdt:shared/Changed',
        payload: { change },
      });
    };

    /**
     * Event Listeners.
     */
    events.changed$.subscribe((change) => fireChange(change));
    listenToIndex(index, shared, { debugLabel, dispose$ });
    listenToShared(shared, index, { debugLabel, dispose$ });

    /**
     * Initialize.
     */
    Sync.indexToShared(index, shared, { debugLabel });
    shared.change((d) => {
      const ua = UserAgent.current;
      const data: t.CrdtSharedPeer = { ua };
      d.peers[peer.id] = data;
    });

    /**
     * API
     */
    return {
      kind: 'crdt.network.shared',
      store,
      index,
      doc: shared,

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
  purge(index: t.StoreIndexState) {
    const purged: string[] = [];
    index.doc.change((d) => {
      const docs = Doc.Data.array(d.docs);
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
} as const;
