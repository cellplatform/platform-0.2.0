export * from '../common';
import { t } from '../common';

/**
 * Constants
 */
export const FIELDS: t.WebRtcInfoFields[] = [
  'Module',
  'Module.Verify',
  'Self',
  'Connections',
  'Connetions.List',
];

export const DEFAULTS = {
  fields: ['Module.Verify', 'Module'] as t.WebRtcInfoFields[],
  indent: 15,
  query: { dev: 'dev', selected: 'selected' },
} as const;
