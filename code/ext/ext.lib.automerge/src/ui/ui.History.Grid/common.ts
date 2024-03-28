import { type t } from './common';

export * from '../common';

/**
 * Constants
 */
const mono: t.CSSProperties = { fontFamily: 'monospace', fontSize: 10, fontWeight: 600 };

export const DEFAULTS = {
  displayName: 'History.Grid',
  hash: { length: 6 },
  empty: { message: 'nothing to display' },
  mono,
} as const;
