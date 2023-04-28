export * from '../common';
import type { t } from '../common';

/**
 * Constants
 */
export const FIELDS: t.WebRtcInfoFields[] = [
  'Module',
  'Module.Verify',
  'Self',
  'State.Shared',
  'Peers',
  'Peers.List',
];

export const DEFAULTS = {
  fields: ['Module.Verify', 'Module'] as t.WebRtcInfoFields[],
  indent: 15,
  query: { dev: 'dev', selected: 'selected' },
} as const;
