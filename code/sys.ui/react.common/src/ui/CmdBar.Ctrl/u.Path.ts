import { DEFAULTS, ObjectPath, type t } from './common';

type O = Record<string, unknown>;
type C = t.CmdPathsObject<t.CmdBarCtrlType>;

/**
 * Path helpers for the <CmdBar>
 */
export const Path = {
  defaults: DEFAULTS.paths,

  /**
   * Prepend the set of paths with a given prefix.
   */
  prepend(prefix: t.ObjectPath, paths: t.CmdBarPaths = DEFAULTS.paths): t.CmdBarPaths {
    const prepend = ObjectPath.prepend;
    return {
      text: prepend(paths.text, prefix),
      cmd: prepend(paths.cmd, prefix),
      history: prepend(paths.history, prefix),
    };
  },

  /**
   * A path resolver.
   */
  resolver(paths: t.CmdBarPaths = DEFAULTS.paths): t.CmdBarPathResolver {
    return (data: O) => {
      return {
        text: ObjectPath.resolve<string>(data, paths.text) || '',
        cmd: ObjectPath.resolve<C>(data, paths.cmd) ?? wrangle.emptyCmd(),
        history: ObjectPath.resolve<string[]>(data, paths.history) ?? [],
      };
    };
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  emptyCmd(): C {
    const cmd: t.CmdPathsObject = {
      name: '',
      params: {},
      counter: { value: 0 },
      tx: '',
    };
    return cmd as C;
  },
} as const;