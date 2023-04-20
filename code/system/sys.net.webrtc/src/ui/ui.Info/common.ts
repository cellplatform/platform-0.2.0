export * from '../common';
import { t } from '../common';

/**
 * Constants
 */
export const FIELDS: t.WebRtcInfoFields[] = ['Module', 'Module.Verify'];

const defaultFields = ['Module.Verify', 'Module'] as t.WebRtcInfoFields[];
export const DEFAULTS = {
  fields: defaultFields,
  indent: 15,
  query: { dev: 'dev', selected: 'selected' },
} as const;
