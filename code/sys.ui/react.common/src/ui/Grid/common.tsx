import { Pkg, type t } from '../common';
import { config } from './common.config';

export * from '../common';

/**
 * Contants
 */
const total: t.GridPoint = { x: 3, y: 3 };

export const DEFAULTS = {
  displayName: `${Pkg.name}:Grid`,
  config,
  total,
  gap: 0,
} as const;
