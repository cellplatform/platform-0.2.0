import { R, type t } from './common';
import { compare, type Operation } from 'fast-json-patch';

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
  asPatch(op: Operation): t.Patch {
    const path = op.path.split('/').filter(Boolean);
    return { ...op, path } as unknown as t.Patch;
  },

  patches<T>(prev: T, next: T) {
    const res = compare(prev as Object, next as Object);
    return res.map(wrangle.asPatch);
  },

  callback(options?: t.ImmutableChangeOptions) {
    if (!options) return;
    if (typeof options === 'function') return options;
    if (typeof options.patches === 'function') return options.patches;
    return;
  },
} as const;
