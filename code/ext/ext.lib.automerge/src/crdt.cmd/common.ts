import { A, slug, type t } from './common';

export * from '../common';
export type * as u from './u.t';

/**
 * Constants
 */
const paths: t.CmdPaths = {
  name: ['name'],
  params: ['params'],
  error: ['error'],
  counter: ['counter'],
  tx: ['tx'],
};

export const DEFAULTS = {
  timeout: 3000,
  paths,
  tx: () => slug(),
  counter: (initial = 0): t.CmdCounter => new A.Counter(initial),
  error: (message: string): t.CmdError => ({ message }),
} as const;
