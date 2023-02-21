import { Automerge, rx, slug, t } from './common';
import { SyncState } from './PeerSyncer.State.mjs';

type Id = string;

/**
 * Wraps the network synchronization logic for single CRDT
 * document and a set of network peers.
 */
export function PeerSyncer<D>(
  eventbus: t.EventBus<any>, // An event bus that fires over a network connection.
  getDoc: () => D,
  setDoc: (doc: D) => void,
  options: { filedir?: t.Fs } = {},
) {
  const { filedir } = options;
  const { dispose, dispose$ } = rx.disposable();
  const bus = rx.busAsType<t.CrdtSyncEvent>(eventbus);
  const state = SyncState({ filedir });
  let _count = 0;

  const sync$ = bus.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => e.type === 'sys.crdt/sync'),
    rx.map((e) => e.payload as t.CrdtSync),
    rx.map((e) => {
      const { tx } = e;
      const message = Wrangle.asUint8Array(e.message);
      return { message, tx };
    }),
  );

  sync$.subscribe(async (e) => {
    const { tx, message } = e;
    const prevSyncState = await state.get();
    const res = Automerge.receiveSyncMessage<D>(getDoc(), prevSyncState, message);
    const [nextDoc, nextSyncState, patch] = res;
    state.set(nextSyncState);
    setDoc(nextDoc);
    update({ tx }); // <== 🌳 Recursion (via network round-trip).
  });

  const update = async (options: { tx?: Id } = {}) => {
    const tx = options.tx || slug();
    const prevSyncState = await state.get();
    const [nextSyncState, message] = Automerge.generateSyncMessage<D>(getDoc(), prevSyncState);
    state.set(nextSyncState);

    if (message) {
      bus.fire({ type: 'sys.crdt/sync', payload: { tx, message } });
      _count++;
    }

    const complete = Boolean(message);
    if (complete) await state.save();

    return { tx, complete };
  };

  const api = {
    get count() {
      return _count;
    },

    state() {
      return state.get();
    },

    update() {
      return update({ tx: slug() });
    },

    async dispose() {
      await state.save();
      dispose();
    },
  };

  return api;
}

/**
 * Helpers
 */
const Wrangle = {
  asUint8Array(input: Uint8Array | ArrayBuffer) {
    return input instanceof Uint8Array ? input : new Uint8Array(input);
  },
};
