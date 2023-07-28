import { type t } from './common';

export * from '../common';
export { Grid } from '../Grid';

/**
 * Constants
 */
const selected: t.EdgePos = ['left', 'top'];

export const DEFAULTS = {
  enabled: true,
  size: 150,
  selected,
} as const;
