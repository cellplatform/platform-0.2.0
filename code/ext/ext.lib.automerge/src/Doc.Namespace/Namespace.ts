import { Lens, rx, toObject, type t } from './common';

type Options<R extends object> = { dispose$?: t.UntilObservable; init?: t.LensInitial<R> };

export const Namespace = {
  /**
   * Create a [Lens] namespace manager for (or within) the a root document.
   *
   * [Context]:
   *      This allows multiple lens to be created on a {map}
   *      object within the single document.
   */
  init<R extends object, N extends string = string>(
    root: t.DocRef<R>,
    path?: t.JsonPath | (() => t.JsonPath),
    options?: Options<R> | t.LensInitial<R>,
  ): t.NamespaceManager<N> {
    const args = wrangle.options(options);
    const events = root.events(args.dispose$);
    const { dispose, dispose$ } = events;

    const container = Lens<R, t.NamespaceMap<N>>(root, path, { init: args.init, dispose$ });
    const cache = new Map<N, t.Lens<{}>>();
    dispose$.subscribe(() => cache.clear());

    /**
     * API
     */
    const api: t.NamespaceManager<N> = {
      kind: 'crdt:namespace',

      get container() {
        type T = t.NamespaceMap<N>;
        if (api.disposed) return {} as T;
        const res = {} as T;
        Array.from(cache).forEach(([key, value]) => (res[key] = toObject(value.current)));
        return res;
      },

      list<L extends object>() {
        return Array.from(cache).map((item) => {
          const namespace = item[0] as N;
          const lens = item[1] as t.Lens<L>;
          return { namespace, lens };
        });
      },

      lens<L extends object>(namespace: N, initial: L, options: { typename?: string } = {}) {
        if (cache.has(namespace)) return cache.get(namespace) as t.Lens<L>;

        // Ensure the namespace {object} exists.
        if (container.current[namespace] === undefined) {
          container.change((d) => (d[namespace] = initial));
        }

        // Construct the lens.
        const { typename } = options;
        const subpath = () => [...wrangle.path(path), namespace];
        const lens = Lens<R, L>(root, subpath, { dispose$, typename });
        lens.dispose$.pipe(rx.take(1)).subscribe(() => cache.delete(namespace));

        // Finish up.
        cache.set(namespace, lens);
        return lens;
      },

      events(dispose$?: t.UntilObservable) {
        return container.events(dispose$);
      },

      typed<T extends string>() {
        return api as unknown as t.NamespaceManager<T>;
      },

      /**
       * Lifecycle
       */
      dispose$,
      dispose,
      get disposed() {
        return events.disposed;
      },
    };

    return api;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  options<R extends object>(input?: Options<R> | t.LensInitial<R>): Options<R> {
    if (typeof input === 'function') return { init: input };
    return input ?? {};
  },

  path(path?: t.JsonPath | (() => t.JsonPath)) {
    return typeof path === 'function' ? path() : path ?? [];
  },
} as const;
