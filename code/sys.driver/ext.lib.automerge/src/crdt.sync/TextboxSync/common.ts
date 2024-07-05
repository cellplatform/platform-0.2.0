import { Pkg } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'Sync.Textbox';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
} as const;
