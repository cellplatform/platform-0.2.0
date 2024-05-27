import { A, type t } from './common';
export * from '../common';

/**
 * Constants
 */
const paths: t.CmdPaths = {
  count: ['count'],
  name: ['name'],
  params: ['params'],
};

export const DEFAULTS = {
  paths,
  counter(initial = 0): t.CmdCount {
    return new A.Counter(initial);
  },
} as const;
