import { type t } from './common';
export * from '../common';

export { Button } from '../Button';
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
} as const;
