import { Pkg } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:DevTools.Button`,
  enabled: true,
  label: 'Unnamed',
} as const;
