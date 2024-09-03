import { Symbols, ObjectPath, rx, slug, type t } from './common';
import { viaObservable } from './Immutable.events';
import { Is, Wrangle } from './u';

type K = string | symbol;
type O = Record<string, unknown>;
const Mutate = ObjectPath.Mutate;

/**
 * Create a new composite proxy that maps to an underlying document(s).
 */
export function map<T extends O, P = t.PatchOperation, E = t.ImmutableEvents<T, P>>(
  map: t.ImmutableMap<T>,
  options: { eventsFactory?: (map: t.ImmutableMap<T>, dispose$?: t.UntilObservable) => E } = {},
): t.ImmutableRef<T, E, P> {
  const $ = rx.subject<t.ImmutableChange<T, P>>();
  let _callback: t.ImmutablePatchCallback<any> | undefined;

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
      if (prop) prop.doc.change((d) => Mutate.value(d, prop.path, value), _callback);
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
    [Symbols.Map]: true,

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
      if (options.eventsFactory) return options.eventsFactory(map, dispose$);
      return viaObservable<T, P>($, dispose$) as E;
    },
  };
}

/**
 * Helpers
 */
const wrangle = {
  initial(map: t.ImmutableMap<any>) {
    const initial = Object.keys(map).reduce((acc: any, key) => {
      const prop = wrangle.prop(map, key);
      acc[key] = Symbol(`map → ${prop?.path.join('/') ?? 'UNKNOWN'}`);
      return acc;
    }, {});

    initial[Symbols.MapProxy] = true;
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
} as const;
