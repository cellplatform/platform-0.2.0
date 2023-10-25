import { R, mapVoid, rx, type t } from './common';

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
    rx.distinctWhile((prev, next) => R.equals(prev.to.cmd, next.to.cmd)),
    rx.filter((e) => Boolean(e.to.cmd)),
    rx.map((e) => e.to.cmd!),
  );

  const focus$ = rx.payload<t.LabelListFocusCmd>(cmd$, 'List:Focus');

  const api: t.LabelListEvents<D> = {
    $,
    total$: $.pipe(
      rx.map((e) => e.to.total),
      rx.distinctWhile((prev, next) => prev === next),
    ),
    selected$: $.pipe(
      rx.map((e) => e.to.selected || ''),
      rx.distinctWhile((prev, next) => prev === next),
    ),
    cmd: {
      $: cmd$,
      redraw$: rx.payload<t.LabelListRedrawCmd>(cmd$, 'List:Redraw'),
      select$: rx.payload<t.LabelListSelectCmd>(cmd$, 'List:Select'),
      focus$: focus$.pipe(
        rx.filter((e) => e.focus),
        mapVoid,
      ),
      blur$: focus$.pipe(
        rx.filter((e) => !e.focus),
        mapVoid,
      ),
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
