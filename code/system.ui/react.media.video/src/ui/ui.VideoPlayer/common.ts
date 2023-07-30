import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const unknown: t.VideoDef = { kind: 'Unknown', id: '' };

export const DEFAULTS = {
  unknown,
} as const;
