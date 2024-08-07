import { DEFAULTS, Delete, ObjectPath, slug, type t, type u } from './common';

type S = string;
type O = Record<string, unknown>;

/**
 * Helpers for resolving and mutating paths.
 */
export const Path = {
  /**
   * Wrangle the paths object from various input types.
   */
  wrangle(input?: t.CmdPaths | t.ObjectPath) {
    const def = DEFAULTS.paths;
    if (!input) return def;
    if (Array.isArray(input)) return Path.prepend(input);
    return typeof input === 'object' ? input : def;
  },

  /**
   * Factory for a resolver that reads path locations from the given abstract document.
   * This might be the root document OR a lens within a document.
   */
  resolver(input?: t.CmdPaths | t.ObjectPath) {
    const paths = Path.wrangle(input);
    const resolve = ObjectPath.resolve;
    const Mutate = ObjectPath.Mutate;
    const api = {
      paths,
      queue: {
        /**
         * The array containing the list of invoked commands.
         */
        list<C extends t.CmdType>(d: O) {
          type T = t.CmdQueueItem<C>[];
          const get = () => resolve<T>(d, paths.queue);
          if (!get()) Mutate.value(d, paths.queue, []);
          return get()!;
        },

        /**
         * Retrieves a helper for working with a single item within the queue.
         */
        index<C extends t.CmdType>(d: O, index?: number) {
          const queue = api.queue.list<C>(d);
          const i = index ?? queue.length;
          const path = [...paths.queue, i];
          if (!queue[i]) Mutate.value(d, path, {});

          const res = {
            index: i,
            path,

            name<N extends S = S>(d: O, defaultValue = '') {
              const name = [...path, 'name'];
              const get = () => resolve<N>(d, name);
              if (!get()) Mutate.value(d, name, defaultValue);
              return get()!;
            },

            params<P extends O = O>(d: O, defaultValue: P) {
              const params = [...path, 'params'];
              const get = () => resolve<P>(d, params);
              if (!get()) Mutate.value(d, params, defaultValue);
              return get()!;
            },

            error<E extends O = O>(d: O, defaultValue?: E) {
              const error = [...path, 'error'];
              const get = () => resolve<E>(d, error);
              if (!get()) Mutate.value(d, error, defaultValue);
              return get()!;
            },

            tx(d: O, defaultValue?: string) {
              const tx = [...path, 'tx'];
              const get = () => resolve<string>(d, tx);
              if (!get()) Mutate.value(d, tx, defaultValue ?? slug());
              return get()!;
            },
          } as const;

          return res;
        },
      },

      name<N extends S = S>(d: O) {
        return (resolve<N>(d, paths.name) || '') as N;
      },

      params<P extends O = O>(d: O, defaultParams: P) {
        const get = () => resolve<P>(d, paths.params);
        if (!get()) Mutate.value(d, paths.params, defaultParams);
        return get()!;
      },

      error<E extends O = O>(d: O, defaultError?: E) {
        const get = () => resolve<E>(d, paths.error);
        if (!get()) Mutate.value(d, paths.error, defaultError);
        return get()!;
      },

      counter(d: O, factory: t.CmdCounterFactory = DEFAULTS.counter) {
        const get = () => resolve<t.CmdCounter>(d, paths.counter);
        if (!get()) Mutate.value(d, paths.counter, factory.create());
        return get()!;
      },

      tx(d: O) {
        return resolve<string>(d, paths.tx) || '';
      },

      toObject<C extends t.CmdType>(
        d: O,
        options: { defaultParams?: C['params']; defaultError?: u.ExtractError<C> } = {},
      ): t.CmdObject<C> {
        type N = C['name'];
        type P = C['params'];
        type E = u.ExtractError<C>;
        return Delete.undefined({
          queue: api.queue.list<C>(d),
          name: api.name<N>(d),
          params: api.params<P>(d, (options.defaultParams ?? {}) as P),
          error: api.error(d, options.defaultError as E),
          count: api.counter(d).value,
          tx: api.tx(d),
        });
      },
    } as const;
    return api;
  },

  /**
   * Prepend a path to each item within a <CmdPaths> set.
   */
  prepend(prefix: t.ObjectPath, paths: t.CmdPaths = DEFAULTS.paths): t.CmdPaths {
    return {
      name: [...prefix, ...paths.name],
      params: [...prefix, ...paths.params],
      error: [...prefix, ...paths.error],
      counter: [...prefix, ...paths.counter],
      tx: [...prefix, ...paths.tx],
      queue: [...prefix, ...paths.queue],
    };
  },

  /**
   * Flags
   */
  Is: {
    commandPaths(input: any): input is t.CmdPaths {
      if (input === null || typeof input !== 'object') return false;
      const obj = input as t.CmdPaths;
      const is = Path.Is.stringArray;
      return is(obj.counter) && is(obj.name) && is(obj.params) && is(obj.tx);
    },

    stringArray(input: any): input is string[] {
      return Array.isArray(input) && input.every((value) => typeof value === 'string');
    },
  },
} as const;
