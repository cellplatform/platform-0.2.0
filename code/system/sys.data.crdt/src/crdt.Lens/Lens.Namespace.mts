import { init as lens } from './Lens.impl.mjs';
import { type t } from './common';

/**
 * A lens namespace manager within the given document.
 *
 * Context:
 *    This allows multiple lens to be created on a {map}
 *    object within the single document.
 */
export function namespace<R extends {}, N extends string = string>(
  doc: t.CrdtDocRef<R>,
  getContainer?: t.CrdtLensDescendent<R, t.CrdtNamespaceMap>,
) {
  return {
    lens<L extends {}>(namespace: N, initial: L) {
      return lens<R, L>(doc, (draft) => {
        const container = (getContainer ? getContainer(draft) : draft) as t.CrdtNamespaceMap;
        const subject = container[namespace] || (container[namespace] = initial ?? {});
        return subject as L;
      });
    },
  } as const;
}
