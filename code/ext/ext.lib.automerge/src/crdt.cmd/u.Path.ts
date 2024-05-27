import { DEFAULTS, ObjectPath, type t } from './common';

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

      name(d: O) {
        return resolve<string>(d, paths.name) || '';
      },

      params<P extends O = O>(d: O, defaultParams: P) {
        const get = () => resolve<P>(d, paths.params);
        if (!get()) ObjectPath.mutate(d, paths.params, defaultParams);
        return get()!;
      },

      counter(d: O) {
        const get = () => resolve<t.CmdCounter>(d, paths.count);
        if (!get()) ObjectPath.mutate(d, paths.count, DEFAULTS.counter());
        return get()!;
      },

      toObject<P extends O = O>(d: O, options: { defaultParams?: P } = {}): t.CmdLensObject<P> {
        return {
          name: api.name(d),
          params: api.params<P>(d, (options.defaultParams ?? {}) as P),
          count: api.counter(d).value,
        };
      },
    } as const;
    return api;
  },
} as const;
