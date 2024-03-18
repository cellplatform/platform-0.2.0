import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const meta: t.DocMeta = {};

export const DEFAULTS = {
  message: { initial: 'initial' },
  timeout: { get: 1500 },
  initial: { meta },
} as const;
