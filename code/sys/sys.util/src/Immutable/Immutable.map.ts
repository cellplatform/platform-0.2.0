import { Delete, ObjectPath, R, Symbols, rx, slug, type t } from './common';
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
    const { formatPatch } = options;
    const $ = rx.subject<t.ImmutableChange<T, P>>();
    const deduped$ = $.pipe(rx.distinctWhile((prev, next) => R.equals(prev.after, next.after)));
    const next = (e: t.ImmutableChange<T, P>) => $.next(wrangle.formatChange(e));

    type C = t.ImmutablePatchCallback<P>;
    let _callback: C | undefined;

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
          const callback: C = (patches) => {
            const formatted = wrangle.patches(patches, prop.key, prop.doc, formatPatch);
            _callback?.(formatted);
          };
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
        fn(proxy);
        _callback = undefined;

        callback?.(patches);
      },

      events(until$?: t.UntilObservable) {
        const events = viaObservable<T, P>(deduped$, until$);
        const dispose$ = events.dispose$;
        monitorSourceChanges<T, P>({ map, proxy, next, formatPatch, dispose$ });
        return events as t.ImmutableEvents<T, P>;
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
    source: O,
    paths: t.ObjectPath[],
  ): T {
    const plucked = paths
      .filter((path) => ObjectPath.exists(source, path))
      .reduce((acc, path) => {
        Mutate.value(acc, path, ObjectPath.resolve(source, path));
        return acc;
      }, {});

    return Object.keys(map)
      .map((key) => wrangle.prop(map, key))
      .filter((prop) => !!prop)
      .reduce((acc, prop) => {
        const key = String(prop.key);
        const pathExists = paths.some((p) => p.join() === prop.path.join());
        const value = pathExists ? ObjectPath.resolve(plucked, prop.path) : proxy[key];
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

  patches<P>(
    patches: P[],
    field: string | symbol,
    doc: t.ImmutableRef,
    formatter?: t.ImmutableMapFormatPatch<P>,
  ) {
    const format: t.ImmutableMapFormatPatch<P> = formatter ?? wrangle.patch;
    const key = String(field);
    return patches.map((patch) => format({ patch, key, doc }));
  },

  formatChange<T extends O, P>(e: t.ImmutableChange<T, P>) {
    const before = Delete.undefined(e.before);
    const after = Delete.undefined(e.after);
    return { ...e, before, after };
  },
} as const;

/**
 * Sets up a monitor to listen for underlying changes in the source documents.
 */
function monitorSourceChanges<T extends O, P>(args: {
  map: t.ImmutableMap<T, P>;
  proxy: O;
  next: (payload: t.ImmutableChange<T, P>) => void;
  dispose$?: t.UntilObservable;
  formatPatch?: t.ImmutableMapFormatPatch<P>;
}) {
  const { map, proxy, next, dispose$, formatPatch } = args;
  Object.keys(map)
    .map((key) => wrangle.prop(map, key)!)
    .filter((prop) => !!prop)
    .forEach((prop) => {
      const events = prop.doc.events(dispose$);
      const changed$ = events.changed$.pipe(rx.filter((e) => !('mapping' in e))); // NB: ignore changes made by (this) the mapper itself.
      changed$
        .pipe(rx.distinctWhile((prev, next) => R.equals(prev.after, next.after)))
        .subscribe((e) => {
          const paths = e.patches.map((p) => ObjectPath.from(p));
          if (paths.length > 0) {
            const before = wrangle.pluckAndMap(map, proxy, e.before, paths);
            const after = wrangle.pluckAndMap(map, proxy, e.after, paths);
            const patches = wrangle.patches(e.patches, prop.key, prop.doc, formatPatch);
            next({ before, after, patches });
          }
        });
    });
}
