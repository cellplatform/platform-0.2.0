import { type t } from './common';

export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: 'History.Grid',
  hash: { length: 6 },
  empty: { message: 'nothing to display' },
} as const;
