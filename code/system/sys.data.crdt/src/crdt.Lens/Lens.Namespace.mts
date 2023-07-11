import { init as lens } from './Lens.impl.mjs';
import { rx, toObject, type t } from './common';

/**
 * A lens namespace manager within the given document.
 *
 * Context:
 *    This allows multiple lens to be created on a {map}
 *    object within the single document.
 */
export function namespace<R extends {}, N extends string = string>(
  root: t.CrdtDocRef<R>,
  getMap?: t.CrdtNamespaceMapLens<R>,
  options?: { dispose$: t.Observable<any> },
) {
  const life = rx.lifecycle([root.dispose$, options?.dispose$]);
  const { dispose, dispose$ } = life;

  /**
   * API.
   */
  const api: t.CrdtNamespaceManager<R, N> = {
    get container() {
      return toObject(Wrangle.container<R, N>(root.current, getMap));
    },

    lens<L extends {}>(namespace: N, initial: L) {
      return lens<R, L>(
        root,
        (draft) => {
          const container = Wrangle.container<R, N>(draft, getMap);
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

/**
 * Helpers
 */
const Wrangle = {
  container<R extends {}, N extends string = string>(root: R, getMap?: t.CrdtNamespaceMapLens<R>) {
    return (getMap ? getMap(root) : root) as t.CrdtNamespaceMap<N>;
  },
};
