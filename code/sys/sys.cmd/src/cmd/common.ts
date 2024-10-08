import { slug, type t } from './common';

export * from '../common';
export type * as u from './u.t';

/**
 * Constants
 */
const paths: t.CmdPaths = {
  queue: ['queue'],
  log: ['log'],
};
const bounds: t.CmdQueueBounds = { min: 50, max: 100 };

export const DEFAULTS = {
  timeout: 3000,
  paths,
  id: () => slug(),
  tx: () => slug(),
  error: (message: string): t.Error => ({ message }),
  log(): t.CmdLog {
    return { total: { purged: 0 } };
  },
  queue: { bounds },
  symbol: {
    transport: Symbol('transport'),
    paths: Symbol('paths'),
    issuer: Symbol('issuer'),
  },
} as const;

/**
 * Helpers
 */
export function isObject(input: any): input is object {
  return typeof input === 'object' && input !== null;
}
