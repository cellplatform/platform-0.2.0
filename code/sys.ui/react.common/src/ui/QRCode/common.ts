import { Pkg } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:QRCode`,
  size: 128,
} as const;
