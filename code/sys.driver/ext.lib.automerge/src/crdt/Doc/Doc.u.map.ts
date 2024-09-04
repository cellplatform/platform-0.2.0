import { Immutable, type t } from './common';

type O = Record<string, unknown>;
type P = t.DocMapPatch;

/**
 * Create a new composite proxy that maps to an underlying document(s).
 */
export function map<T extends O>(map: t.ImmutableMap<T>): t.DocMap<T> {
  return Immutable.map<T, P>(map, {
    formatPatch(e) {
      const doc = (e.doc as t.Doc).uri ?? '';
      return { ...e.patch, mapping: { key: e.key, doc } } as P;
    },
  });
}
