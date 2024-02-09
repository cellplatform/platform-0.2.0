import { type t } from './common';
export * from '../common';

export { Flip } from '../Flip';
export { Spinner } from '../Spinner';

/**
 * Constants
 */

const theme: t.ModuleLoaderTheme = 'Light';
const spinning: t.ModuleLoaderSpinning = {
  width: 50,
  bodyOpacity: 0.2,
  transition: 150,
};

export const DEFAULTS = {
  displayName: 'ModuleLoader',
  theme,
  spinning,
  flipped: false,
} as const;
