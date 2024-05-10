import { rx, type t } from './common';

type O = Record<string, unknown>;

/**
 * Default [PatchState] event factory.
 */
export function defaultEvents<T extends O>(
  $: t.Observable<t.PatchChange<T>>,
  dispose$?: t.UntilObservable,
): t.PatchStateEvents<T> {
  const life = rx.lifecycle(dispose$);
  return {
    $: $.pipe(rx.takeUntil(life.dispose$)),
    dispose: life.dispose,
    dispose$: life.dispose$,
    get disposed() {
      return life.disposed;
    },
  };
}
