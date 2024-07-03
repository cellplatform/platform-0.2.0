import { rx, type t } from './common';
import { Wrangle } from './u';

/**
 * Change Patch Standard:
 *    RFC-6902 JSON patch standard
 *    https://tools.ietf.org/html/rfc6902
 */
type P = t.PatchOperation;

/**
 * Generic events for an Immutable<T> object
 * achieved by overriding the [change] method.
 */
export function changeOverriden<T>(
  source: t.Immutable<T, P>,
  dispose$?: t.UntilObservable,
): t.ImmutableEvents<T, P> {
  const $ = rx.subject<t.ImmutableChange<T, P>>();
  const api = fromObservable<T>($, dispose$);
  const base = source.change;
  api.dispose$.subscribe(() => (source.change = base));
  source.change = curryChange<T>($, base, () => source.current);
  return api;
}

/**
 * Implementation for a override function for [Immutable.change].
 */
export function curryChange<T>(
  $: t.Subject<t.ImmutableChange<T, P>>,
  change: t.Immutable<T, P>['change'],
  current: () => T,
): t.Immutable<T, P>['change'] {
  return (fn, options) => {
    const before = current();
    const callback = Wrangle.callback(options);
    let patches: P[] = [];
    change(fn, {
      ...options,
      patches(e) {
        patches = e;
        callback?.(e);
      },
    });
    const after = current();
    $.next({ before, after, patches });
  };
}

/**
 * ImmutableEvents<T> structure.
 */
export function fromObservable<T>(
  $: t.Observable<t.ImmutableChange<T, t.PatchOperation>>,
  dispose$?: t.UntilObservable,
): t.ImmutableEvents<T, P> {
  const life = rx.lifecycle(dispose$);
  const changed$ = $.pipe(rx.takeUntil(life.dispose$));
  return {
    changed$,
    dispose: life.dispose,
    dispose$: life.dispose$,
    get disposed() {
      return life.disposed;
    },
  };
}
