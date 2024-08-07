import { slug, type t } from './common';

export * from '../common';
export type * as u from './u.t';

/**
 * Constants
 */
const paths: t.CmdPaths = {
  queue: ['queue'],
};

export const DEFAULTS = {
  timeout: 3000,
  paths,
  tx: () => slug(),
  error: (message: string): t.Error => ({ message }),
  symbol: { transport: Symbol('transport') },
} as const;

/**
 * Helpers
 */
export function isObject(input: any): input is object {
  return typeof input === 'object' && input !== null;
}
