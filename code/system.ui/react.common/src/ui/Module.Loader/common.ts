import { type t } from './common';
export * from '../common';

export { Flip } from '../Flip';
export { Spinner } from '../Spinner';

/**
 * Constants
 */
const theme: t.ModuleLoaderTheme = 'Light';
const spinner: t.ModuleLoaderSpinner = { bodyOpacity: 0.2, bodyBlur: 0 };

export const DEFAULTS = {
  displayName: 'ModuleLoader',
  theme,
  spinner,
  spinning: false,
  flipped: false,
} as const;
