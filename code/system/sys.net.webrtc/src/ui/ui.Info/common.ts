export * from '../common';
import type { t } from '../common';

/**
 * Constants
 */
export const FIELDS: t.WebRtcInfoField[] = [
  'Module',
  'Module.Verify',
  'Self.Id',
  'State.Shared',
  'Peers',
  'Peers.List',
];

export const DEFAULTS = {
  fields: ['Module.Verify', 'Module'] as t.WebRtcInfoField[],
  indent: 15,
  query: { dev: 'dev', selected: 'selected' },
} as const;
