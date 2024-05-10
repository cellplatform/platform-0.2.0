import { type t } from '../common';
export * from '../common';

/**
 * Contants
 */
import { config } from './common.config';
export const total: t.GridPoint = { x: 3, y: 3 };
export const DEFAULTS = {
  config,
  total,
  gap: 0,
} as const;
