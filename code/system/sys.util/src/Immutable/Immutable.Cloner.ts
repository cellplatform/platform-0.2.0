import { R, type t } from './common';

/**
 * A simple Immutable<T> implementation using brute-force cloning.
 *
 * NOTE:
 *    This is simple, BUT NOT performant on large objects.
 */
export function cloner<T>(
  initial: T,
  options: { clone?: <T>(input: T) => T } = {},
): t.Immutable<T> {
  const { clone = R.clone } = options;
  let _current = clone(initial);
  return {
    get current() {
      return _current;
    },
    change(fn) {
      const next = clone(_current);
      fn(next);
      _current = next;
    },
  };
}
