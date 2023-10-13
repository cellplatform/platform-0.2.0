import { R, rx, type t, mapVoid } from './common';

type O = Record<string, unknown>;

/**
 * Event wrapper factory.
 */
export function events<D extends O = O>(
  $: t.Observable<t.PatchChange<t.LabelList<D>>>,
  dispose$?: t.UntilObservable,
): t.LabelListEvents<D> {
  const lifecycle = rx.lifecycle(dispose$);
  $ = $.pipe(rx.takeUntil(lifecycle.dispose$));

  const cmd$ = $.pipe(
    rx.distinctUntilChanged((prev, next) => R.equals(prev.to.cmd, next.to.cmd)),
    rx.filter((e) => Boolean(e.to.cmd)),
    rx.map((e) => e.to.cmd!),
  );

  const api: t.LabelListEvents<D> = {
    $,
    cmd: {
      $: cmd$,
      focus$: rx.payload<t.LabelListCmdFocus>(cmd$, 'List:Focus').pipe(mapVoid),
    },

    /**
     * Lifecycle
     */
    dispose: lifecycle.dispose,
    dispose$: lifecycle.dispose$,
    get disposed() {
      return lifecycle.disposed;
    },
  };

  return api;
}
