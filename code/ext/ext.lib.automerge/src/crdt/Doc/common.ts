import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const meta: t.DocMeta = {};

export const DEFAULTS = {
  initial: { meta },
  message: { initial: 'sys: initial commit' },
  page: { sort: 'asc' },
  timeout: { get: 1500 },
} as const;
