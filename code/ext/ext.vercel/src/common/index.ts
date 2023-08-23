import type * as t from './types.mjs';

export type { t };
export * from '../index.pkg.mjs';
export * from './libs.mjs';

/**
 * Constants
 */
export const DEFAULT = {
  id: 'default-instance',
  batch: 10,
} as const;
