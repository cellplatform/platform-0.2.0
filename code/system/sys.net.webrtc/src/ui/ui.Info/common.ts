import type { t } from '../common';

export { WebRtcState } from '../../WebRtc.State';
export * from '../common';

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

const fieldsAll: t.WebRtcInfoField[] = [
  'Module',
  'Module.Verify',
  'Self.Id',
  'State.Shared',
  'Group',
  'Group.Peers',
  'Peer',
  'Peer.Connections',
];

const defaultFields: t.WebRtcInfoField[] = [
  'Module.Verify',
  'Module',
  'Self.Id',
  'Group',
  'Group.Peers',
  'State.Shared',
];

export const DEFAULTS = {
  fields: {
    all: fieldsAll,
    default: defaultFields,
  },
  indent: 15,
  fontSize: 13,
  minRowHeight: 16,
  query: { dev: 'dev', selected: 'selected' },
} as const;
