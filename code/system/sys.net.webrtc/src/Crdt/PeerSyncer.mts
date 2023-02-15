import { t, rx, Automerge } from './common';

export type CrdtSyncEvent = { type: 'sys.crdt/sync'; payload: CrdtSync };
export type CrdtSync = { message: Uint8Array };

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
  const bus = rx.busAsType<CrdtSyncEvent>(args.bus);

  let _syncState = initSyncState();

  const sync$ = bus.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => e.type === 'sys.crdt/sync'),
    rx.map((e) => e.payload as CrdtSync),
    rx.map((e) => (e.message instanceof Uint8Array ? e.message : new Uint8Array(e.message))),
  );

  sync$.subscribe((message) => {
    const res = receiveSyncMessage<D>(api.doc, _syncState, message);
    const [nextDoc, nextSyncState, patch] = res;
    _syncState = nextSyncState;
    args.setDoc(nextDoc);
    api.update(); // <== 🌳 recursion (via network).
  });

  const api = {
    dispose,
    get doc() {
      return args.getDoc();
    },
    update() {
      const [nextSyncState, message] = generateSyncMessage<D>(api.doc, _syncState);
      _syncState = nextSyncState;
      if (message) {
        bus.fire({ type: 'sys.crdt/sync', payload: { message } });
      }
      return Boolean(message);
    },
  };

  return api;
}
