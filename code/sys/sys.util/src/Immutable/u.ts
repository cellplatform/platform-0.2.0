import { compare } from 'fast-json-patch';
import { type t } from './common';
export * from './u.Is';

type P = t.PatchOperation;

export const Wrangle = {
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
