import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const width: t.PropListSize = { min: 230 };
export const DEFAULTS = {
  query: { dev: 'dev' },
  width,
} as const;
