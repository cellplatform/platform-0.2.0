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
    rx.distinctWhile((prev, next) => R.equals(prev.after.cmd, next.after.cmd)),
    rx.filter((e) => !!e.after.cmd),
    rx.map((e) => e.after.cmd!),
  );

  const focus$ = rx.payload<t.LabelListFocusCmd>(cmd$, 'List:Focus');
  const active$ = $.pipe(
    rx.map((e) => e.after),
    rx.map(({ focused, selected }) => ({ focused: !!focused, selected })),
    rx.distinctUntilChanged((prev, next) => R.equals(prev, next)),
  );

  const api: t.LabelListEvents<D> = {
    $,
    total$: $.pipe(
      rx.map((e) => e.after.total),
      rx.distinctWhile((prev, next) => prev === next),
    ),
    editing$: $.pipe(
      rx.map((e) => e.after.editing || ''),
      rx.distinctWhile((prev, next) => prev === next),
    ),
    active: {
      $: active$,
      selected$: active$.pipe(rx.distinctWhile((p, n) => p.selected == n.selected)),
      focused$: active$.pipe(rx.distinctWhile((p, n) => p.focused == n.focused)),
    },
    cmd: {
      $: cmd$,
      redraw$: rx.payload<t.LabelListRedrawCmd>(cmd$, 'List:Redraw'),
      select$: rx.payload<t.LabelListSelectCmd>(cmd$, 'List:Select'),
      edit$: rx.payload<t.LabelListEditCmd>(cmd$, 'List:Edit'),
      remove$: rx.payload<t.LabelListRemoveCmd>(cmd$, 'List:Remove'),
      focus$: focus$.pipe(
        rx.filter((e) => e.focus),
        mapVoid,
      ),
      blur$: focus$.pipe(
        rx.filter((e) => !e.focus),
        mapVoid,
      ),
      filter<T>(fn?: (e: T) => boolean) {
        return cmd$.pipe(
          rx.map((e) => e as T),
          rx.filter((e) => (fn ? fn(e) : true)),
        );
      },
    },

    item(id, dispose$?: t.UntilObservable) {
      const $ = api.active.$.pipe(rx.takeUntil(dispose$ || rx.noop$));
      const selected$ = $.pipe(
        rx.map((next) => next.selected === id),
        rx.distinctWhile((prev, next) => prev === next),
      );
      const focused$ = $.pipe(
        rx.map((next) => next.selected === id && next.focused),
        rx.distinctWhile((prev, next) => prev === next),
      );
      return { selected$, focused$ } as const;
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
