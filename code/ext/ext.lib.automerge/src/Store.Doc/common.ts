import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const meta: t.DocMeta = {};

export const DEFAULTS = {
  timeout: { get: 1500 },
  initial: { meta },
} as const;
