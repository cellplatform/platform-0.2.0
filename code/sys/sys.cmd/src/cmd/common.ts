import { slug, type t } from './common';

export * from '../common';
export type * as u from './u.t';

/**
 * Constants
 */
const paths: t.CmdPaths = {
  queue: ['queue'],
  name: ['name'],
  params: ['params'],
  error: ['error'],
  counter: ['counter'],
  tx: ['tx'],
};

const counter: t.CmdCounterFactory = {
  create(initial = 0) {
    return { value: initial };
  },
  increment(mutate) {
    mutate.value += 1;
  },
};

export const DEFAULTS = {
  timeout: 3000,
  paths,
  counter,
  tx: () => slug(),
  error: (message: string): t.Error => ({ message }),
  symbol: { transport: Symbol('transport') },
} as const;
