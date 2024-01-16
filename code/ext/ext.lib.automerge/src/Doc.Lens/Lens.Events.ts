import { rx, type t } from './common';

/**
 * Generate a new events wrapper for the given handle.
 */
export function eventsFactory<R extends {}, L extends {}>(
  source$: t.Observable<t.LensEvent<R, L>>,
  options: { dispose$?: t.UntilObservable } = {},
) {
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;
  const $ = source$.pipe(rx.takeUntil(dispose$));

  const api: t.LensEvents<R, L> = {
    $,
    changed$: rx.payload<t.LensChangedEvent<R, L>>($, 'crdt:lens:changed'),
    deleted$: rx.payload<t.LensDeletedEvent<R, L>>($, 'crdt:lens:deleted'),

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
