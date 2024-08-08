import { slug, type t } from './common';

export * from '../common';
export type * as u from './u.t';

/**
 * Constants
 */
const paths: t.CmdPaths = { queue: ['queue'], total: ['total'] };
const bounds: t.CmdQueueBounds = { min: 10, max: 100 };

export const DEFAULTS = {
  timeout: 3000,
  paths,
  tx: () => slug(),
  error: (message: string): t.Error => ({ message }),
  total(): t.CmdTotals {
    return { purged: 0 };
  },
  queue: { bounds, autoPurge: true },
  symbol: {
    transport: Symbol('transport'),
    paths: Symbol('paths'),
  },
} as const;

/**
 * Helpers
 */
export function isObject(input: any): input is object {
  return typeof input === 'object' && input !== null;
}
