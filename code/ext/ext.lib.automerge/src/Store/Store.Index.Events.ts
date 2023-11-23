import { rx, type t } from './common';

/**
 * Factory for the Index events object.
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
      rx.filter((e) => e.patches[0].action === 'insert'),
      rx.filter((e) => e.patches[0].path[0] === 'docs'),
      rx.filter((e) => typeof e.patches[0].path[1] === 'number'),
    )
    .subscribe((e) => {
      const index = e.patches[0].path[1] as number;
      const item = e.patchInfo.after.docs[index];
      if (item) {
        const total = e.patchInfo.after.docs.length;
        $$.next({ type: 'crdt:store:index/Added', payload: { index, total, item } });
      }
    });

  changed$
    .pipe(
      rx.filter((e) => e.patches[0].action === 'del'),
      rx.filter((e) => e.patches[0].path[0] === 'docs'),
      rx.filter((e) => typeof e.patches[0].path[1] === 'number'),
    )
    .subscribe((e) => {
      const index = e.patches[0].path[1] as number;
      const item = e.patchInfo.before.docs[index];
      if (item) {
        const total = e.patchInfo.after.docs.length;
        $$.next({ type: 'crdt:store:index/Removed', payload: { index, total, item } });
      }
    });

  /**
   * API
   */
  const api: t.StoreIndexEvents = {
    $,
    changed$,
    added$: rx.payload<t.StoreIndexAddedEvent>($, 'crdt:store:index/Added'),
    removed$: rx.payload<t.StoreIndexRemovedEvent>($, 'crdt:store:index/Removed'),

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
