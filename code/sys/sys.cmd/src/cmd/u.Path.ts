import { DEFAULTS, isObject, ObjectPath, slug, type t } from './common';

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
        item<C extends t.CmdType>(d: O, index?: number) {
          const queue = api.queue.list<C>(d);
          const i = index ?? queue.length;
          const path = [...paths.queue, i];
          if (!queue[i]) Mutate.value(d, path, {});

          const item = {
            index: i,
            path,

            name<N extends S = S>(defaultValue = '') {
              const name = [...path, 'name'];
              const get = () => resolve<N>(d, name);
              if (!get()) Mutate.value(d, name, defaultValue);
              return get()!;
            },

            params<P extends O = O>(defaultValue: P) {
              const params = [...path, 'params'];
              const get = () => resolve<P>(d, params);
              if (!get()) Mutate.value(d, params, defaultValue);
              return get()!;
            },

            error<E extends O = O>(defaultValue?: E) {
              const error = [...path, 'error'];
              const get = () => resolve<E>(d, error);
              if (!get()) Mutate.value(d, error, defaultValue);
              return get()!;
            },

            tx(defaultValue?: string) {
              const tx = [...path, 'tx'];
              const get = () => resolve<string>(d, tx);
              if (!get()) Mutate.value(d, tx, defaultValue ?? slug());
              return get()!;
            },
          } as const;

          return item;
        },
      },

      toObject<C extends t.CmdType>(d: O): t.CmdObject<C> {
        const queue = api.queue.list<C>(d);
        return { queue };
      },
    } as const;
    return api;
  },

  /**
   * Prepend a path to each item within a <CmdPaths> set.
   */
  prepend(prefix: t.ObjectPath, paths: t.CmdPaths = DEFAULTS.paths): t.CmdPaths {
    return {
      queue: [...prefix, ...paths.queue],
    };
  },

  /**
   * Flags
   */
  Is: {
    commandPaths(input: any): input is t.CmdPaths {
      if (!isObject(input)) return false;
      const obj = input as t.CmdPaths;
      const is = Path.Is.stringArray;
      return is(obj.queue);
    },

    stringArray(input: any): input is string[] {
      return Array.isArray(input) && input.every((value) => typeof value === 'string');
    },
  },
} as const;
