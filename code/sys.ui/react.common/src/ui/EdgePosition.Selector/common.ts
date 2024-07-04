import { Pkg, type t } from './common';

export * from '../common';
export { Grid } from '../Grid';

/**
 * Constants
 */
const selected: t.EdgePos = ['left', 'top'];

export const DEFAULTS = {
  displayName: `${Pkg.name}:EdgePositionSelector`,
  enabled: true,
  size: 150,
  selected,
} as const;
