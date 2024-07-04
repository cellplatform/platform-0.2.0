import { Pkg, type t } from './common';

export { Button } from '../Button';
export { Icons } from '../Icons';
export { Slider } from '../Slider';
export * from '../common';

/**
 * Constants
 */
const axis: t.Axis = 'x';

export const DEFAULTS = {
  displayName: `${Pkg.name}:SplitLayout`,
  split: 0.6,
  axis,
} as const;
