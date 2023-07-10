import { init as lens } from './Lens.impl.mjs';
import { rx, type t } from './common';

/**
 * A lens namespace manager within the given document.
 *
 * Context:
 *    This allows multiple lens to be created on a {map}
 *    object within the single document.
 */
export function namespace<R extends {}, N extends string = string>(
  doc: t.CrdtDocRef<R>,
  getMap?: t.CrdtNamespaceMapLens<R>,
  options?: { dispose$: t.Observable<any> },
) {
  const life = rx.lifecycle([doc.dispose$, options?.dispose$]);
  const { dispose, dispose$ } = life;

  /**
   * API.
   */
  const api: t.CrdtNamespaceManager<R, N> = {
    lens<L extends {}>(namespace: N, initial: L) {
      return lens<R, L>(
        doc,
        (draft) => {
          const container = (getMap ? getMap(draft) : draft) as t.CrdtNamespaceMap;
          const subject = container[namespace] || (container[namespace] = initial ?? {});
          return subject as L;
        },
        { dispose$ },
      );
    },

    /**
     * Lifecycle
     */
    dispose$,
    dispose,
    get disposed() {
      return life.disposed;
    },
  } as const;

  return api;
}
