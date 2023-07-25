import { css, type t } from '../common';

export * from '../common';

/**
 * Contants
 */
import { total, config } from './common.defaultConfig';

export const DEFAULTS = {
  config,
  total,
  gap: 0,
} as const;
