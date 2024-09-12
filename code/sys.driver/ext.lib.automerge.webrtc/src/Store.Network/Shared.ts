import { eventsFactory } from './Shared.Events';
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

  Doc: {
    init(d: t.CrdtShared) {
      Doc.Meta.ensure(d, Shared.Doc.meta);
      d.sys = { peers: {}, docs: {} };
      d.ns = {};
    },

    get type(): t.DocMetaType {
      const name: t.CrdtSharedState['kind'] = 'crdt.network.shared';
      return { name };
    },

    get meta(): t.DocMeta {
      const type = Shared.Doc.type;
      return { ...Doc.Meta.default, type, ephemeral: true };
    },

    /**
     * Get or create a [Shared] document type from the given store.
     */
    async getOrCreate(store: t.Store, uri?: string) {
      /**
       * NOTE: as over verion 1.2.0 of [automerge-repo] this "binary hack" started
       *       causing sync errors, and was able to be removed and continued
       *       to work.  Discord discussion on the matter here:
       *
       *          https://discord.com/channels/1200006940210757672/1202325266937159690/1262593958467469355
       *          https://discord.com/channels/1200006940210757672/1230453235207110666/1231192657666248768
       *
       * 💡 When we are sure this works, this can be deleted.
       */

      // const { binary } = await import('./Shared.binary');
      // return store.doc.getOrCreate<t.CrdtShared>(binary, uri);

      return store.doc.getOrCreate<t.CrdtShared>((d) => Shared.Doc.init(d), uri);
    },
  },

  /**
   * Create a new ephemeral document manager for a store/peer.
   */
  async create(args: {
    $: t.Observable<t.WebrtcStoreEvent>;
    peer: t.PeerModel;
    store: t.Store;
    index: t.StoreIndex;
    debugLabel?: string;
    uri?: string;
    fire?: (e: t.WebrtcStoreEvent) => void;
  }) {
    const { index, peer, store, debugLabel } = args;
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose, dispose$ } = life;

    /**
     * TODO 🐷 persist / re-use the doc (??), or delete on network disconnect.
     */

    /**
     * Setup the "shared" CRDT syncing document.
     */
    const doc = await Shared.Doc.getOrCreate(store, args.uri);
    const fireChanged = (payload: t.DocChanged<t.CrdtShared>) => {
      args.fire?.({
        type: 'crdt:net:shared/Changed',
        payload,
      });
    };

    /**
     * Event Listeners.
     */
    doc.events(dispose$).changed$.subscribe((change) => fireChanged(change));
    listenToIndex(index, doc, { debugLabel, dispose$ });
    listenToShared(doc, index, { debugLabel, dispose$ });

    /**
     * Initialize.
     */
    Sync.indexToShared(index, doc, { debugLabel });
    doc.change((d) => {
      const ua = UserAgent.current;
      const data: t.CrdtSharedPeer = { ua };
      const peers = d.sys?.peers;
      if (peers) peers[peer.id] = data;
    });

    /**
     * API
     */
    let _ns: t.NamespaceManager | undefined;
    const api: t.CrdtSharedState = {
      kind: 'crdt.network.shared',
      doc,

      get ns() {
        return _ns || (_ns = Shared.ns(doc));
      },

      events(until$) {
        const dispose$ = [until$, life.dispose$];
        return eventsFactory({ $: args.$, dispose$ });
      },

      /**
       * Lifecycle
       */
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    };
    return api;
  },

  /**
   * Remove all ephemeral documents from the given repo-index.
   */
  purge(index: t.StoreIndex) {
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

  /**
   * Construct a namespace-manager to operate on the {ns}
   * field of the [Shared] state document.
   */
  ns<N extends string = string>(shared: t.Doc<t.CrdtShared>) {
    type T = t.NamespaceManager<N>;
    return Doc.ns<t.CrdtShared, N>(shared, ['ns'], (d) => (d.ns = {})) as T;
  },
} as const;
