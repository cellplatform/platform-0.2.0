import { rx, type t } from './common';

/**
 * Generate a new events wrapper for the given handle.
 */
export function eventsFactory<T>(
  ref: t.DocRefHandle<T>,
  options: { dispose$?: t.UntilObservable } = {},
) {
  const handle = ref.handle;
  const uri = handle.url;
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;

  dispose$.subscribe(() => fire$?.complete());
  const fire$ = new rx.Subject<t.DocEvent<T>>();
  const fire = (e: t.DocEvent<T>) => fire$.next(e);
  const $ = fire$.pipe(rx.takeUntil(dispose$));

  handle.on('change', (e) => {
    const { doc, patches, patchInfo } = e;
    fire({
      type: 'crdt:doc/Changed',
      payload: { uri, doc, patches, patchInfo },
    });
  });

  /**
   * API
   */
  const api: t.DocEvents<T> = {
    $,
    changed$: rx.payload<t.DocChangedEvent<T>>($, 'crdt:doc/Changed'),

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
