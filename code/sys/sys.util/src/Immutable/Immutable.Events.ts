import { rx, type t } from './common';

type P = t.PatchOperation;

/**
 * Generic events for an Immutable<T> object.
 */
export function events<T>(
  source: t.Immutable<T, P>,
  dispose$?: t.UntilObservable,
): t.ImmutableEvents<T> {
  const life = rx.lifecycle(dispose$);
  const $ = rx.subject<t.ImmutableChange<T>>();
  life.dispose$.subscribe(() => (source.change = change));

  /**
   * Override: change handler
   */
  const change = source.change;
  source.change = (fn, options) => {
    const before = source.current;
    change.call(source, fn, options);
    const after = source.current;
    $.next({ before, after });
  };

  /**
   * API
   */
  return {
    changed$: $.pipe(rx.takeUntil(life.dispose$)),
    dispose: life.dispose,
    dispose$: life.dispose$,
    get disposed() {
      return life.disposed;
    },
  };
}
