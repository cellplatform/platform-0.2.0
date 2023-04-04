export * from '../common';
import { t } from '../common.t';

/**
 * Constants
 */
export const FIELDS: t.CrdtInfoFields[] = ['Module', 'Driver', 'History.Total', 'History.Item'];

const fields = ['Module'] as t.CrdtInfoFields[];
export const DEFAULTS = { fields } as const;
