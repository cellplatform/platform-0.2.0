import * as FastJsonPatch from 'npm:fast-json-patch';

import type { t } from './common.ts';
export * from './u.Is.ts';

type Patch = t.PatchOperation;

export const Wrangle = {
  patches<T>(prev: T, next: T) {
    return FastJsonPatch.default.compare(prev as Object, next as Object);
  },

  options<P = Patch>(input?: t.ImmutableChangeOptionsInput<P>): t.ImmutableChangeOptions<P> {
    if (!input || input === null) return {};
    if (typeof input === 'function') return { patches: input };
    return input;
  },
} as const;
