import { Automerge, rx, slug, type t } from './common';
import { SyncState } from './PeerSyncer.State.mjs';
import { toObject } from '../helpers';

type Id = string;

/**
 * Wraps the network synchronization logic for single CRDT
 * document and a set of network peers.
 */
export function PeerSyncer<D extends {}>(
  netbus: t.EventBus<any>, // An event-bus that fires over a network connection.
  docid: Id,
  getDoc: () => D,
  setDoc: (doc: D) => void,
  options: { filedir?: t.Fs } = {},
): t.PeerSyncer<D> {
  const { filedir } = options;
  const { dispose, dispose$ } = rx.disposable();
  dispose$.subscribe(() => {
    _updated$.complete();
  });

  const bus = rx.busAsType<t.CrdtEvent>(netbus);
  const state = SyncState({ filedir, dispose$ });

  let _count = 0;
  let _bytes = 0;
  const getCurrentDoc = () => ({ id: docid, data: toObject<D>(getDoc()) });

  const _updated$ = new rx.Subject<t.PeerSyncUpdated<D>>();

  const sync$ = bus.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => e.type === 'sys.crdt/sync'),
    rx.map((e) => e.payload as t.CrdtSyncMessage),
    rx.filter((e) => e.docid === docid),
    rx.map((e) => {
      const { tx } = e;
      const message = e.message ? Wrangle.asUint8Array(e.message) : null;
      return { tx, message };
    }),
  );

  sync$.subscribe(async (e) => {
    const { tx, message } = e;
    if (message) {
      const prevSyncState = await state.get();
      const res = Automerge.receiveSyncMessage<D>(getDoc(), prevSyncState, message);
      const [nextDoc, nextSyncState, patch] = res;
      state.set(nextSyncState);

      setDoc(nextDoc);
      const count = (_count += 1);
      const bytes = (_bytes += message.byteLength);
      _updated$.next({ tx, count, bytes, doc: getCurrentDoc() });

      update({ tx }); // <== 🌳 RECURSION (via network round-trip).
    }
  });

  const update = async (args: { tx: Id }) => {
    const tx = args.tx || slug();
    const prevSyncState = await state.get();
    const [nextSyncState, message] = Automerge.generateSyncMessage<D>(getDoc(), prevSyncState);
    state.set(nextSyncState);

    bus.fire({
      type: 'sys.crdt/sync',
      payload: { tx, docid, message },
    });

    const complete = !Boolean(message);
    if (complete) await state.save();
    return { tx, complete };
  };

  const api: t.PeerSyncer<D> = {
    $: _updated$.pipe(rx.takeUntil(dispose$)),

    get count() {
      return _count;
    },

    get bytes() {
      return _bytes;
    },

    state() {
      return state.get();
    },

    update() {
      let _complete: undefined | Promise<t.PeerSyncUpdated<D>>;
      const tx = slug();
      update({ tx });
      return {
        tx,
        get complete() {
          if (_complete) return _complete;

          let count = 0;
          let bytes = 0;
          const tx$ = sync$.pipe(rx.filter((e) => e.tx === tx));

          tx$.pipe(rx.filter((e) => e.message !== null)).subscribe((e) => {
            bytes += e.message?.length ?? 0;
            count += 1;
          });

          const complete$ = tx$.pipe(
            rx.filter((e) => e.message === null),
            rx.take(1),
            rx.delay(10),
            rx.map(() => ({ tx, bytes, count, doc: getCurrentDoc() })),
          );

          return (_complete = rx.firstValueFrom(complete$));
        },
      };
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
