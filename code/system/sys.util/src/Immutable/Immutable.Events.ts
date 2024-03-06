import { rx, type t } from './common';

/**
 * Generic events for an Immutable<T> object.
 */
export function events<T>(
  source: t.Immutable<T>,
  dispose$?: t.UntilObservable,
): t.ImmutableEvents<T> {
  const life = rx.lifecycle(dispose$);
  const $ = rx.subject<t.ImmutableChange<T>>();
  life.dispose$.subscribe(() => (source.change = change));

  /**
   * Override: change handler
   */
  const change = source.change;
  source.change = (fn) => {
    const from = source.current;
    change.call(source, fn);
    const to = source.current;
    $.next({ from, to });
  };

  /**
   * API
   */
  return {
    $: $.pipe(rx.takeUntil(life.dispose$)),
    dispose: life.dispose,
    dispose$: life.dispose$,
    get disposed() {
      return life.disposed;
    },
  };
}
