import { fromObservable, curryChange } from './Immutable.event';
import { R, rx, slug, type t } from './common';
import { Wrangle } from './u';

/**
 * Change Patch Standard:
 *    RFC-6902 JSON patch standard
 *    https://tools.ietf.org/html/rfc6902
 */
type P = t.PatchOperation;

/**
 * A simple Immutable<T> implementation using brute-force cloning.
 * NOTE:
 *    This is simple, BUT NOT performant on large objects.
 */
export function cloner<T>(
  initial: T,
  options: { clone?: <T>(input: T) => T } = {},
): t.Immutable<T, P> {
  const { clone = R.clone } = options;
  let _current = clone(initial);
  return {
    get current() {
      return _current;
    },
    change(fn, options) {
      const prev = _current;
      const next = clone(_current);
      fn(next);
      _current = next;
      Wrangle.callback(options)?.(Wrangle.patches(prev, next));
    },
  };
}

/**
 * A simple ImmutableRef<T> implementation using brute-force cloning.
 * NB:
 *    This is simple, BUT NOT performant on large objects.
 * NB:
 *    This is used as the default Immutable structure for the [sys.cmd]
 *    <Cmd> system unit tests.
 */
export function clonerRef<T>(initial: T, options: { clone?: <T>(input: T) => T } = {}) {
  const $ = rx.subject<t.ImmutableChange<T, P>>();
  const inner = cloner<T>(initial, options);
  const api: t.ImmutableRef<T, t.ImmutableEvents<T, P>, P> = {
    instance: slug(),
    get current() {
      return inner.current;
    },
    change: curryChange($, inner.change, () => inner.current),
    events: (dispose$?: t.UntilObservable) => fromObservable<T>($, dispose$),
  };
  return api;
}
