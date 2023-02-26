export * from '../common';
import { t } from '../common.t';

/**
 * Constants
 */
export const FIELDS: t.CrdtInfoFields[] = ['Module'];
export const DEFAULTS = {
  fields: ['Module'] as t.CrdtInfoFields[],
} as const;
