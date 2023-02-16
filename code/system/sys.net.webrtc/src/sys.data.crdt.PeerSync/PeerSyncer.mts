import { t, rx, Automerge, slug } from './common';

type Id = string;

/**
 * TODO 🐷
 * - [ ] encode/decode sync-state between session.
 * - [ ] throw errors.
 */

export function PeerSyncer<D>(args: {
  bus: t.EventBus<any>;
  getDoc: () => D;
  setDoc: (doc: D) => void;
}) {
  const { initSyncState, generateSyncMessage, receiveSyncMessage } = Automerge;
  const { dispose, dispose$ } = rx.disposable();
  const bus = rx.busAsType<t.CrdtSyncEvent>(args.bus);

  /**
   * TODO 🐷 - encode/decode sync-state between session.
   */
  let _syncState = initSyncState();

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

  sync$.subscribe((e) => {
    const { tx, message } = e;
    const res = receiveSyncMessage<D>(api.doc, _syncState, message);
    const [nextDoc, nextSyncState, patch] = res;
    _syncState = nextSyncState;
    args.setDoc(nextDoc);
    update({ tx }); // <== 🌳 Recursion (via network round-trip).
  });

  const update = (options: { tx?: Id } = {}) => {
    const tx = options.tx || slug();
    const [next, message] = generateSyncMessage<D>(api.doc, _syncState);
    _syncState = next;
    if (message) {
      bus.fire({ type: 'sys.crdt/sync', payload: { tx, message } });
    }
    return {
      tx,
      complete: Boolean(message),
    };
  };

  const api = {
    dispose,
    get doc() {
      return args.getDoc();
    },
    state() {
      return _syncState;
    },
    update() {
      return update({ tx: slug() });
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
