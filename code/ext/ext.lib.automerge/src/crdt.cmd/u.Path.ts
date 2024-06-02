import { DEFAULTS, Delete, ObjectPath, type t, type u } from './common';

type S = string;
type O = Record<string, unknown>;

/**
 * Helpers for resolving and mutating paths.
 */
export const Path = {
  /**
   * Factory for a resolver that reads path locations from the given abstract document.
   * This might be the root document OR a lens within a document.
   */
  resolver(paths: t.CmdPaths = DEFAULTS.paths) {
    const resolve = ObjectPath.resolve;
    const api = {
      paths,

      name<N extends S = S>(d: O) {
        return (resolve<N>(d, paths.name) || '') as N;
      },

      params<P extends O = O>(d: O, defaultParams: P) {
        const get = () => resolve<P>(d, paths.params);
        if (!get()) ObjectPath.mutate(d, paths.params, defaultParams);
        return get()!;
      },

      error<E extends O = O>(d: O, defaultError?: E) {
        const get = () => resolve<E>(d, paths.error);
        if (!get()) ObjectPath.mutate(d, paths.error, defaultError);
        return get()!;
      },

      counter(d: O) {
        const get = () => resolve<t.CmdCounter>(d, paths.counter);
        if (!get()) ObjectPath.mutate(d, paths.counter, DEFAULTS.counter());
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
  prepend(input: t.CmdPaths, prefix: t.ObjectPath): t.CmdPaths {
    return {
      name: [...prefix, ...input.name],
      params: [...prefix, ...input.params],
      error: [...prefix, ...input.error],
      counter: [...prefix, ...input.counter],
      tx: [...prefix, ...input.tx],
    };
  },

  /**
   * Flags
   */
  is: {
    commandPaths(input: any): input is t.CmdPaths {
      if (input === null || typeof input !== 'object') return false;
      const obj = input as t.CmdPaths;
      const is = Path.is.stringArray;
      return is(obj.counter) && is(obj.name) && is(obj.params) && is(obj.tx);
    },

    stringArray(input: any): input is string[] {
      return Array.isArray(input) && input.every((value) => typeof value === 'string');
    },
  },
} as const;
