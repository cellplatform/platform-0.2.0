import { init as Lens } from '../crdt.Lens/Lens.impl.mjs';
import { rx, toObject, type t } from './common';
import { Wrangle } from './Wrangle.mjs';

/**
 * A lens namespace manager within the given document.
 *
 * [Context]:
 *      This allows multiple lens to be created on a {map}
 *      object within the single document.
 */
export function CrdtNamespace<R extends {}, N extends string = string>(
  root: t.CrdtDocRef<R>,
  getMap?: t.CrdtNsMapGetLens<R>,
  options?: { dispose$: t.Observable<any> },
): t.CrdtNsManager<R, N> {
  const life = rx.lifecycle([root.dispose$, options?.dispose$]);
  const { dispose, dispose$ } = life;
  const container = Wrangle.containerLens<R, N>(root, getMap, dispose$);
  const cache = new Map<N, t.CrdtLens<R, {}>>();
  dispose$.subscribe(() => cache.clear());

  /**
   * API.
   */
  const api: t.CrdtNsManager<R, N> = {
    kind: 'Crdt:Namespace',

    get $() {
      return container.$;
    },

    get container() {
      type T = t.CrdtNsMap<N>;
      if (api.disposed) return {} as T;

      const res = {} as T;
      Array.from(cache).forEach(([key, value]) => (res[key] = toObject(value.current)));
      return res;
    },

    lens<L extends {}>(namespace: N, initial: L) {
      if (cache.has(namespace)) return cache.get(namespace) as t.CrdtLens<R, L>;

      const lens = Lens<R, L>(
        root,
        (draft) => {
          const container = Wrangle.container<R, N>(draft, getMap);
          const subject = container[namespace] || (container[namespace] = initial ?? {});
          return subject as L;
        },
        { dispose$ },
      );

      cache.set(namespace, lens);
      lens.dispose$.pipe(rx.take(1)).subscribe(() => cache.delete(namespace));
      return lens;
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

  // Finish up.
  return api;
}
