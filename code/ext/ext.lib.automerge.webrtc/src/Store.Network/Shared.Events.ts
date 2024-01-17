import { rx, type t } from './common';

/**
 * Generate a new events wrapper for the (WebRTC) shared state.
 */
export function eventsFactory(args: {
  $: t.Observable<t.WebrtcStoreEvent>;
  dispose$?: t.UntilObservable;
}) {
  const life = rx.lifecycle(args.dispose$);
  const { dispose, dispose$ } = life;

  type TEventType = t.CrdtSharedEvent['type'];
  const sharedTypes: TEventType[] = ['crdt:webrtc:shared/Ready', 'crdt:webrtc:shared/Changed'];
  const $ = args.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => sharedTypes.includes(e.type as TEventType)),
    rx.map((e) => e as t.CrdtSharedEvent),
  );

  const api: t.CrdtSharedEvents = {
    $,
    ready$: rx.payload<t.CrdtSharedReadyEvent>($, 'crdt:webrtc:shared/Ready'),

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
