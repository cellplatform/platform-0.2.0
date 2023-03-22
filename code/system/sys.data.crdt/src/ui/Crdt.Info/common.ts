export * from '../common';
import { t } from '../common.t';

/**
 * Constants
 */
export const FIELDS: t.CrdtInfoFields[] = ['Module', 'Driver'];
export const DEFAULTS = {
  fields: ['Module'] as t.CrdtInfoFields[],
} as const;
