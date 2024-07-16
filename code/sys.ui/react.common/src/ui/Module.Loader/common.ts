import { Pkg, type t } from './common';
export * from '../common';

export { Button } from '../Button';
export { Icons } from '../Icons';
export { Spinner } from '../Spinner';

/**
 * Constants
 */
const theme: t.CommonTheme = 'Light';
const spinner: t.ModuleLoaderSpinner = { bodyOpacity: 0.2, bodyBlur: 0 };

export const DEFAULTS = {
  displayName: `${Pkg.name}:ModuleLoader`,
  theme,
  spinner,
  spinning: false,
} as const;
