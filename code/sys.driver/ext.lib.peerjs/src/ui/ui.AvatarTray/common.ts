import { Pkg } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:AvatarTray`,
  size: 48,
  muted: true,
  gap: 10,
  borderRadius: 6,
} as const;
