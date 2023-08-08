import { type t } from './common';

export { Icons } from '../Icons.mjs';
export * from '../common';

/**
 * Constants
 */
const status: t.PlayButtonStatus = 'Play';
const statuses: t.PlayButtonStatus[] = ['Play', 'Pause', 'Replay'];

const size: t.PlayButtonSize = 'Medium';
const sizes: t.PlayButtonSize[] = ['Small', 'Medium', 'Large'];

export const DEFAULTS = {
  status,
  statuses,
  enabled: true,
  spinning: false,
  size,
  sizes,
} as const;
