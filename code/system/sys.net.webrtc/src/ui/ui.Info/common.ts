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
  'Group',
  'Group.Peers',
  'Peer',
  'Peer.Connections',
];

export const DEFAULTS = {
  fields: [
    'Module.Verify',
    'Module',
    'Self.Id',
    'Group',
    'Group.Peers',
    'State.Shared',
  ] as t.WebRtcInfoField[],
  indent: 15,
  fontSize: 13,
  query: { dev: 'dev', selected: 'selected' },
} as const;
