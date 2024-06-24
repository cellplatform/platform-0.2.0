import { Cmd, DEFAULTS, ObjectPath, type t } from './common';

type O = Record<string, unknown>;

/**
 * Helpers for resolving and mutating paths.
 */
export const Path = {
  default: DEFAULTS.paths,

  mutate(paths: t.CmdBarPaths = DEFAULTS.paths) {
    return {
      text: (d: O, value: string) => ObjectPath.mutate(d, paths.text, value),
    };
  },

  /**
   * Factory for a resolver that reads path locations from the given abstract document.
   * This might be the [root] of a document, or a [lens] into it.
   */
  resolver(paths: t.CmdBarPaths = DEFAULTS.paths) {
    const resolve = ObjectPath.resolve;
    const cmd = Cmd.Path.resolver(paths.cmd);
    const api = {
      text: (d: O) => resolve<string>(d, paths.text) || '',
      toObject(d: O) {
        return {
          text: api.text(d),
          cmd: cmd.toObject<t.CmdBarType>(d),
        };
      },
    } as const;
    return api;
  },
} as const;
