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
  getContainer?: t.CrdtLensDescendent<R, t.CrdtLensNamespace>,
) {
  return <T extends {}>(address: N, initial: T) => {
    return lens<R, T>(doc, (draft) => {
      const container = (getContainer ? getContainer(draft) : draft) as t.CrdtLensNamespace;
      const subject = container[address] || (container[address] = initial ?? {});
      return subject as T;
    });
  };
}
