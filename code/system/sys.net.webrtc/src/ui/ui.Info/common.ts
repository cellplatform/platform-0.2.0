export * from '../common';
import { t } from '../common';

/**
 * Constants
 */
export const FIELDS: t.WebRtcInfoFields[] = ['Module', 'Module.Verify'];

const fields = ['Module'] as t.WebRtcInfoFields[];
export const DEFAULTS = {
  fields,
  indent: 15,
  query: { dev: 'dev', selected: 'selected' },
} as const;
