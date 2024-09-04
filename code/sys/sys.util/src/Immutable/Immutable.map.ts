import { ObjectPath, Symbols, rx, slug, type t } from './common';
import { viaObservable } from './Immutable.events';
import { Is, Wrangle, toObject } from './u';

type K = string | symbol;
type O = Record<string, unknown>;

const Mutate = ObjectPath.Mutate;

/**
 * Tools for creating composite objects.
 */
export const Map = {
  toObject,

  /**
   * Create a new composite proxy that maps to an underlying document(s).
   */
  create<T extends O, P = t.ImmutableMapPatchDefault>(
    map: t.ImmutableMap<T, P>,
    options: { formatPatch?: t.ImmutableMapFormatPatch<P> } = {},
  ) {
    const $ = rx.subject<t.ImmutableChange<T, P>>();

    type C = t.ImmutablePatchCallback<P>;
    let _callback: C | undefined;

    const formatPatches = (patches: P[], key: string | symbol, doc: t.ImmutableRef) => {
      const format: t.ImmutableMapFormatPatch<P> = options.formatPatch ?? wrangle.patch;
      return patches.map((patch) => format({ patch, key: String(key), doc }));
    };

    /**
     * Proxy
     */
    const initial = wrangle.initial(map);
    const get = (key: K) => {
      const prop = wrangle.prop(map, key);
      return prop ? ObjectPath.resolve(prop.doc.current, prop.path) : undefined;
    };
    const proxy = new Proxy(initial, {
      get(_, key) {
        return get(key);
      },
      set(_, key, value) {
        const prop = wrangle.prop(map, key);
        if (prop) {
          const callback: C = (patches) => _callback?.(formatPatches(patches, prop.key, prop.doc));
          prop.doc.change((d) => Mutate.value(d, prop.path, value), callback as any);
        }
        return true;
      },

      ownKeys(_) {
        return Reflect.ownKeys(_);
      },
      getOwnPropertyDescriptor(_, key) {
        return {
          configurable: true,
          enumerable: true,
          writable: false,
          value: get(key),
        };
      },
    });

    /**
     * API
     */
    const api: t.ImmutableRef<T, P, t.ImmutableEvents<T, P>> = {
      instance: slug(),
      [Symbols.map]: true,

      get current() {
        return proxy as T;
      },

      change(fn, options) {
        const callback = Wrangle.options(options).patches;
        const patches: P[] = [];
        _callback = (e) => patches.push(...e);

        const before = wrangle.current<T, P>(map, proxy);
        fn(proxy as any);
        const after = wrangle.current<T, P>(map, proxy);

        _callback = undefined;
        callback?.(patches);
        $.next({ before, after, patches });
      },

      events(dispose$?: t.UntilObservable) {
        const res = viaObservable<T, P>($, dispose$);

        // Fire changes through map when underlying source document(s) change.
        Object.keys(map)
          .map((key) => wrangle.prop(map, key)!)
          .filter((prop) => !!prop)
          .forEach((prop) => {
            const events = prop.doc.events(res.dispose$);
            const changed$ = events.changed$.pipe(rx.filter((e) => !('mapping' in e))); // NB: ignore changes made by (this) the mapper itself.
            changed$.subscribe((e) => {
              const paths = e.patches.map((p) => ObjectPath.from(p));
              if (paths.length > 0) {
                const before = wrangle.pluckAndMap(map, proxy, e.before, paths);
                const after = wrangle.pluckAndMap(map, proxy, e.after, paths);
                const patches = formatPatches(e.patches, prop.key, prop.doc);
                $.next({ before, after, patches });
              }
            });
          });

        return res as t.ImmutableEvents<T, P>;
      },
    };
    return api;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  initial(map: t.ImmutableMap<any, any>) {
    const initial = Object.keys(map).reduce((acc: any, key) => {
      const prop = wrangle.prop(map, key);
      acc[key] = Symbol(`map → ${prop?.path.join('/') ?? 'UNKNOWN'}`);
      return acc;
    }, {});

    initial[Symbols.proxy] = true;
    return initial;
  },

  prop<T extends O, P>(map: t.ImmutableMap<T, P>, key: string | symbol) {
    const item = map[key as any];
    if (!Array.isArray(item)) return;

    type E = t.ImmutableEvents<T, P>;
    const [doc, field] = item;
    const path = typeof field === 'string' ? [field] : field;
    if (!ObjectPath.Is.path(path) || !Is.immutableRef<T, P, E>(doc)) return;

    return { doc, key, path } as const;
  },

  current<T extends O, P>(map: t.ImmutableMap<T, P>, proxy: O): T {
    return Object.keys(map).reduce((acc, key) => {
      (acc as any)[key] = proxy[key];
      return acc;
    }, {} as T);
  },

  pluckAndMap<T extends O, P>(
    map: t.ImmutableMap<T, P>,
    proxy: O,
    data: O,
    paths: t.ObjectPath[],
  ): T {
    const plucked = paths
      .filter((path) => ObjectPath.exists(data, path))
      .map((path) => ({ path, value: ObjectPath.resolve(data, path) }))
      .reduce((acc, next) => {
        Mutate.value(acc, next.path, next.value);
        return acc;
      }, {});

    return Object.keys(map)
      .map((key) => wrangle.prop(map, key))
      .filter((prop) => !!prop)
      .reduce((acc, prop) => {
        const key = String(prop.key);
        const exists = ObjectPath.exists(plucked, prop.path);
        const value = exists ? ObjectPath.resolve(plucked, prop.path) : proxy[key];
        Mutate.value(acc, [key], value);
        return acc;
      }, {} as T);
  },

  patch<P>(args: t.ImmutableMapFormatPatchArgs<P>): P {
    const mapping: t.ImmutableMapPatchInfo = {
      doc: `instance:${args.doc.instance}`,
      key: args.key,
    };
    return { ...args.patch, mapping };
  },
} as const;
