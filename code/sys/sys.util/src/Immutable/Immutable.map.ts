import { ObjectPath, Symbols, rx, slug, type t } from './common';
import { viaObservable } from './Immutable.events';
import { Is, Wrangle, toObject } from './u';

type K = string | symbol;
type O = Record<string, unknown>;
// type DefaultPatch = t.ImmutableMapPatch<t.PatchOperation>;

const Mutate = ObjectPath.Mutate;

/**
 * Tools for creating composite objects.
 */
export const Map = {
  toObject,

  /**
   * Create a new composite proxy that maps to an underlying document(s).
   */
  create<T extends O, P = t.ImmutableMapPatchDefault, E = t.ImmutableEvents<T, P>>(
    map: t.ImmutableMap<T>,
    options: { formatPatch?: t.ImmutableMapFormatPatch<P> } = {},
  ): t.ImmutableRef<T, P, E> {
    const $ = rx.subject<t.ImmutableChange<T, P>>();

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
        if (!prop) return false;

        const doc = prop.doc;
        const callback: C = (patches) => {
          const format: t.ImmutableMapFormatPatch<P> = options.formatPatch ?? wrangle.patch;
          patches = patches.map((patch) => format({ patch, key: String(key), doc }));
          _callback?.(patches);
        };

        prop.doc.change((d) => Mutate.value(d, prop.path, value), callback as any);
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
    return {
      instance: slug(),
      [Symbols.map]: true,

      get current() {
        return proxy as T;
      },

      change(fn, options) {
        const callback = Wrangle.callback(options);
        const patches: P[] = [];
        _callback = (e) => patches.push(...e);

        const before = wrangle.current<T>(map, proxy);
        fn(proxy as any);
        const after = wrangle.current<T>(map, proxy);

        _callback = undefined;
        callback?.(patches);
        $.next({ before, after, patches });
      },

      events(dispose$?: t.UntilObservable) {
        return viaObservable<T, P>($, dispose$) as E;
      },
    };
  },
} as const;

/**
 * Helpers
 */
type Prop = {};

const wrangle = {
  initial(map: t.ImmutableMap<any>) {
    const initial = Object.keys(map).reduce((acc: any, key) => {
      const prop = wrangle.prop(map, key);
      acc[key] = Symbol(`map → ${prop?.path.join('/') ?? 'UNKNOWN'}`);
      return acc;
    }, {});

    initial[Symbols.proxy] = true;
    return initial;
  },

  prop<T extends O>(map: t.ImmutableMap<T>, key: string | symbol) {
    const item = map[key as any];
    if (!Array.isArray(item)) return;

    const [doc, field] = item;
    const path = typeof field === 'string' ? [field] : field;
    if (!ObjectPath.Is.path(path) || !Is.immutableRef(doc)) return;
    return { doc, path } as const;
  },

  current<T extends O>(map: t.ImmutableMap<T>, proxy: O): T {
    return Object.keys(map).reduce((acc, key) => {
      (acc as any)[key] = proxy[key];
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
