import { compare } from 'fast-json-patch';
import { R, type t } from './common';

type P = t.Operation;

/**
 * A simple Immutable<T> implementation using brute-force cloning.
 *
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
      wrangle.callback(options)?.(wrangle.patches(prev, next));
    },
  };
}

/**
 * Helpers
 */
const wrangle = {
  patches<T>(prev: T, next: T) {
    return compare(prev as Object, next as Object);
  },

  callback(options?: t.ImmutableChangeOptions<P>) {
    if (!options) return;
    if (typeof options === 'function') return options;
    if (typeof options.patches === 'function') return options.patches;
    return;
  },
} as const;
