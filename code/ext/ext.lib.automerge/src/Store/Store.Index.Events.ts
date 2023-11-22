import { rx, type t } from './common';

/**
 * Factory for the Index events objectl
 */
export function events(index: t.StoreIndex, options: { dispose$?: t.UntilObservable } = {}) {
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;

  const subject$ = rx.subject<t.StoreIndexEvent>();
  const $ = subject$.pipe(rx.takeUntil(dispose$));
  const doc = index.doc.events(dispose$);
  doc.$.subscribe((e) => subject$.next(e));

  /**
   * API
   */
  const api: t.StoreIndexEvents = {
    $,
    changed$: rx.payload<t.DocChangedEvent<t.RepoIndex>>($, 'crdt:DocChanged'),

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
