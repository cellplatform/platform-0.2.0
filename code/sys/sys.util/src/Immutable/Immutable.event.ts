import { rx, type t } from './common';
import { Wrangle } from './u';

/**
 * Change Patch Standard:
 *    RFC-6902 JSON patch standard
 *    https://tools.ietf.org/html/rfc6902
 */
type P = t.PatchOperation;

/**
 * Generic events for an Immutable<T> object.
 */
export function overrideChange<T>(
  source: t.Immutable<T, P>,
  dispose$?: t.UntilObservable,
): t.ImmutableEvents<T, P> {
  const life = rx.lifecycle(dispose$);
  const $ = rx.subject<t.ImmutableChange<T, P>>();
  life.dispose$.subscribe(() => (source.change = change));

  /**
   * Override: change handler
   */
  const change = source.change;
  source.change = (fn, options) => {
    const before = source.current;
    const callback = Wrangle.callback(options);
    let patches: P[] = [];
    change.call(source, fn, {
      ...options,
      patches(e) {
        patches = e;
        callback?.(e);
      },
    });
    const after = source.current;
    $.next({ before, after, patches });
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
