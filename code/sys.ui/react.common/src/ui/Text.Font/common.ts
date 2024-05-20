import { DEFAULTS as FLIP } from '../Flip/common';
import { Pkg } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: { FontCard: `${Pkg.name}.FontCard` },
  char: 'à',
  fontSize: 120,
  fontFamily: 'sans-serif',
  speed: FLIP.speed,
} as const;
