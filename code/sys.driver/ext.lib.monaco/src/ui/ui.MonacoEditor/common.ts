import { Pkg, DEFAULTS as BASE } from '../common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  ...BASE,
  displayName: `${Pkg.name}:MonacoEditor`,
} as const;
