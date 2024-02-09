import { type t } from './common';
export * from '../common';

export { Flip } from '../Flip';
export { Spinner } from '../Spinner';

/**
 * Constants
 */

const spinning: t.ModuleLoaderSpinning = { width: 50 };
const theme: t.ModuleLoaderTheme = 'Light';

export const DEFAULTS = {
  displayName: 'ModuleLoader',
  theme,
  spinning,
  flipped: false,
} as const;
