import { R, type t } from './common';
import { compare, type Operation } from 'fast-json-patch';
import { Value } from '../Value';
import { Delete } from '../Delete';

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
  asAction(op: Operation['op']): t.Patch['action'] {
    if (op === 'add') return 'insert';
    if (op === 'remove') return 'del';
    if (op === 'replace') return 'put';
    throw new Error(`op '${op}' not supported`);
  },

  asPatch(op: Operation): t.Patch {
    const path = op.path
      .split('/')
      .filter(Boolean)
      .map((v) => Value.toType(v));
    const action = wrangle.asAction(op.op);
    const value = (op as any).value;
    return Delete.undefined({ action, path, value }) as t.Patch;
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
