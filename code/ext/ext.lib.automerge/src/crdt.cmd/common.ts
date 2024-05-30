import { A, slug, type t } from './common';

export * from '../common';
export type * as u from './u.t';

/**
 * Constants
 */
const paths: t.CmdPaths = {
  counter: ['counter'],
  name: ['name'],
  params: ['params'],
  tx: ['tx'],
};

export const DEFAULTS = {
  paths,
  tx: () => slug(),
  counter: (initial = 0): t.CmdCounter => new A.Counter(initial),
} as const;
