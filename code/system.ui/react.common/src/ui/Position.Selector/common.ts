import { type t } from './common';

export * from '../common';
export { Grid } from '../Grid';

const selected: t.Pos = ['left', 'top'];

/**
 * Constants
 */
export const DEFAULTS = {
  enabled: true,
  size: 150,
  selected,
} as const;
