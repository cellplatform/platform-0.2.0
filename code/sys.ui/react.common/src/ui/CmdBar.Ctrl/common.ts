import { DEFAULTS as BASE } from '../CmdBar/common';
export * from '../CmdBar/common';

/**
 * Constants
 */
export const DEFAULTS = {
  ...BASE,
  symbol: {
    cmd: Symbol('cmd'),
  },
} as const;
