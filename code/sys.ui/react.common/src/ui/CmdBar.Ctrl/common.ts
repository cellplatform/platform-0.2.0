import { DEFAULTS as BASE, type t } from '../CmdBar/common';
export * from '../CmdBar/common';

/**
 * Constants
 */
export const DEFAULTS = {
  ...BASE,
  symbol: {
    cmd: Symbol('cmd'),
    paths: Symbol('paths'),
  },
  get meta(): t.CmdBarMeta {
    return { history: [] };
  },
} as const;
