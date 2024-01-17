import { rx, type t } from './common';

/**
 * Generate a new events wrapper for the (WebRTC) network Store.
 */
export function eventsFactory(
  source$: t.Observable<t.WebrtcStoreEvent>,
  options: { dispose$?: t.UntilObservable } = {},
) {
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;

  const $ = source$.pipe(rx.takeUntil(dispose$));

  const api: t.WebrtcStoreEvents = {
    $,

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
