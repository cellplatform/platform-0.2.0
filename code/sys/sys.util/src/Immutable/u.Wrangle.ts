import { compare } from 'fast-json-patch';
import { type t } from './common';
export * from './u.Is';

type Patch = t.PatchOperation;

export const Wrangle = {
  patches<T>(prev: T, next: T) {
    return compare(prev as Object, next as Object);
  },

  options<P = Patch>(input?: t.ImmutableChangeOptionsInput<P>): t.ImmutableChangeOptions<P> {
    if (!input || input === null) return {};
    if (typeof input === 'function') return { patches: input };
    return input;
  },
} as const;
