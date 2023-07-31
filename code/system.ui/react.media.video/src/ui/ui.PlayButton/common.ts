import { type t } from './common';

export * from '../common';
export { Icons } from '../Icons.mjs';

/**
 * Constants
 */
const status: t.PlayButtonStatus = 'Play';
export const DEFAULTS = {
  status,
  width: 56,
  height: 32,
} as const;
