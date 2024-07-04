import { Button } from '../DevTools.Button';
import { Pkg } from './common';

export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  ...Button.DEFAULT,
  displayName: `${Pkg.name}:DevTools.Button.Boolean`,
  value: false,
} as const;
