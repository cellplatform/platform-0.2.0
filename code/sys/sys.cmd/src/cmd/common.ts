import { slug, type t } from './common';

export * from '../common';
export type * as u from './u.t';

/**
 * Constants
 */
const paths: t.CmdPaths = {
  queue: ['queue'],
  total: ['total'],
};

const bounds: t.CmdQueueBounds = { min: 0, max: 100 };
const queue = { bounds };

export const DEFAULTS = {
  symbol: { transport: Symbol('transport') },
  timeout: 3000,
  paths,
  queue,
  tx: () => slug(),
  error: (message: string): t.Error => ({ message }),
  total(): t.CmdTotals {
    return { purged: 0 };
  },
} as const;

/**
 * Helpers
 */
export function isObject(input: any): input is object {
  return typeof input === 'object' && input !== null;
}
