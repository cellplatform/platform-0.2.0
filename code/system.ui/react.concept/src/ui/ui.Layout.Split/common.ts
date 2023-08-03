import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const axis: t.Axis = 'x';

export const DEFAULTS = {
  percent: 0.6,
  axis,
} as const;
