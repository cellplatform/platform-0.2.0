import { rx, type t } from './common';

/**
 * Generate a new events wrapper for the (WebRTC) network Store.
 */
export function eventsFactory(
  store: t.WebrtcStore,
  source$: t.Observable<t.WebrtcStoreEvent>,
  options: { dispose$?: t.UntilObservable } = {},
) {
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;

  const $ = source$.pipe(rx.takeUntil(dispose$));
  const added$ = rx.payload<t.WebrtcStoreAdapterAddedEvent>($, 'crdt:webrtc/AdapterAdded');
  const message$ = rx.payload<t.WebrtcStoreMessageEvent>($, 'crdt:webrtc/Message');

  let _peer: t.PeerModelEvents;

  const api: t.WebrtcStoreEvents = {
    $,
    added$,
    message$,

    get peer() {
      return _peer || (_peer = store.peer.events(dispose$));
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
}
