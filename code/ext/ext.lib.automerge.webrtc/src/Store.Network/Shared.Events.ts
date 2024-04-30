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
  const sharedEventTypes: TEventType[] = ['crdt:webrtc:shared/Changed'];
  const $ = args.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => sharedEventTypes.includes(e.type as TEventType)),
    rx.map((e) => e as t.CrdtSharedEvent),
  );

  const api: t.CrdtSharedEvents = {
    $,
    changed$: rx.payload<t.CrdtSharedChangedEvent>($, 'crdt:webrtc:shared/Changed'),

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
