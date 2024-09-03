import { Is, PatchState, R, Value, type t } from './common';
import { Data } from './u.data';

/**
 * Helpers for performing object comparisons.
 */
const document = {
  /**
   * Compre two {data} property objects.
   */
  isEqual(prev?: t.InfoData, next?: t.InfoData) {
    if (!prev && !next) return false;
    if ((!prev && next) || (prev && !next)) return true;

    const a = document.simplify(prev);
    const b = document.simplify(next);

    if (!R.equals(a.docUris, b.docUris)) return true;
    if (!R.equals(a.data, b.data)) return true;
    return false;
  },

  /**
   * Strip down the {data} object into a simpler proxy that takes out
   * functions and other complex objects (like Store's and CRDTs)
   * to allow simple isEqual checks.
   */
  simplify(input: t.InfoData = {}) {
    const docRefs: t.Doc[] = [];
    const document = Data.document.list(input.document).map((item) => {
      item = { ...item };
      if (Is.doc(item.uri)) {
        docRefs.push(item.uri);
        item.uri = item.uri.uri;
      }
      return item;
    });

    const data = PatchState.create({ ...input, document });
    data.change((d) => {
      Value.Object.walk(d, (e) => {
        if (typeof e.value === 'function') e.mutate(undefined);
      });
    });

    return {
      docRefs,
      docUris: docRefs.map((d) => d.uri),
      data: data.current,
    } as const;
  },
} as const;

/**
 * Export
 */
export const Diff = { document } as const;
