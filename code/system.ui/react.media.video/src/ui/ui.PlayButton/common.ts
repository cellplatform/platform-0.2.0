import { type t } from './common';

export * from '../common';
export { Icons } from '../Icons.mjs';

/**
 * Constants
 */
const status: t.PlayButtonStatus = 'Play';
const statuses: t.PlayButtonStatus[] = ['Play', 'Pause', 'Replay'];

const size: t.PlayButtonSize = 'medium';
const sizes: t.PlayButtonSize[] = ['small', 'medium', 'large'];

export const DEFAULTS = {
  status,
  statuses,
  enabled: true,
  spinning: false,
  size,
  sizes,
} as const;
