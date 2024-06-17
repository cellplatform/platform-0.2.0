import { rx, type t } from './common';
import { eventsFactory as sharedEventsFactory } from './Shared.Events';

/**
 * Generate a new events wrapper for the (WebRTC) network Store.
 */
export function eventsFactory(args: {
  $: t.Observable<t.WebrtcStoreEvent>;
  store: t.Store;
  peer: t.PeerModel;
  dispose$?: t.UntilObservable;
}) {
  const life = rx.lifecycle(args.dispose$);
  const { dispose, dispose$ } = life;

  const $ = args.$.pipe(rx.takeUntil(dispose$));
  const added$ = rx.payload<t.WebrtcStoreAdapterAddedEvent>($, 'crdt:net:webrtc/AdapterAdded');
  const message$ = rx.payload<t.WebrtcStoreMessageEvent>($, 'crdt:net:webrtc/Message');

  let _peer: t.PeerModelEvents;
  let _shared: t.CrdtSharedEvents;

  const api: t.WebrtcStoreEvents = {
    $,
    added$,
    message$,

    get peer() {
      return _peer || (_peer = args.peer.events(dispose$));
    },

    get shared() {
      return _shared || (_shared = sharedEventsFactory({ $, dispose$ }));
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
