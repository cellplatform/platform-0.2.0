import { type t } from '../common';

export * from '../common';

/**
 * Contants
 */

const total: t.GridPoint = { x: 3, y: 3 };

export const DEFAULTS = {
  total,
  gap: 0,
} as const;
