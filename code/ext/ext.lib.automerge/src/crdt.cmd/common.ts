import { A, type t } from './common';
export * from '../common';

/**
 * Constants
 */
const paths: t.CmdPaths = {
  counter: ['counter'],
  name: ['name'],
  params: ['params'],
};

export const DEFAULTS = {
  paths,
  counter(initial = 0): t.CmdCounter {
    return new A.Counter(initial);
  },
} as const;
