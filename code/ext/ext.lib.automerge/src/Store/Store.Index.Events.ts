import { rx, type t } from './common';

/**
 * Factory for the Index events objectl
 */
export function events(index: t.StoreIndex, options: { dispose$?: t.UntilObservable } = {}) {
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;

  const $$ = rx.subject<t.StoreIndexEvent>();
  const $ = $$.pipe(rx.takeUntil(dispose$));
  const changed$ = rx.payload<t.DocChangedEvent<t.RepoIndex>>($, 'crdt:DocChanged');
  const doc = index.doc.events(dispose$);
  doc.$.subscribe((e) => $$.next(e));

  changed$
    .pipe(
      rx.map((e) => e.patches[0]),
      rx.filter((e) => e.action === 'insert'),
      rx.filter((e) => e.path[0] === 'docs'),
      rx.filter((e) => typeof e.path[1] === 'number'),
    )
    .subscribe((e) => {
      const i = e.path[1] as number;
      const item = index.doc.current.docs[i];
      if (item) {
        $$.next({ type: 'crdt:store:index/Added', payload: { index: i, item } });
      }
    });

  /**
   * API
   */
  const api: t.StoreIndexEvents = {
    $,
    changed$,
    added$: rx.payload<t.StoreIndexAddedEvent>($, 'crdt:store:index/Added'),

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
