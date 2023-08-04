import { type t } from './common';

export * from '../common';
export { Icons } from '../Icons.mjs';

/**
 * Constants
 */
const axis: t.Axis = 'x';

export const DEFAULTS = {
  split: 0.6,
  axis,
} as const;
