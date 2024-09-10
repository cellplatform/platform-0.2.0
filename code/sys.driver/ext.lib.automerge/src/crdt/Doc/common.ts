import { A, Time, type t } from './common';
export * from '../common';

/**
 * Constants
 */
const meta: t.DocMeta = {};

export const DEFAULTS = {
  initial: { meta },
  page: { sort: 'asc' },
  timeout: { get: 1500 },
  genesis: {
    message: 'system: initial commit',
    options<T>(): A.ChangeOptions<T> {
      const message = DEFAULTS.genesis.message;
      const time = Time.now.timestamp;
      return { message, time };
    },
  },
} as const;
