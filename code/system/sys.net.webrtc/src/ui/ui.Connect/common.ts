import { type t } from '../common';

export * from '../common';
export { WebRtc } from '../../WebRtc';

/**
 * Defaults
 */
const edge: t.Edge = 'Top';
const fields: t.WebRtcInfoField[] = ['State.Shared', 'Group', 'Group.Peers'];

export const DEFAULTS = {
  edge,
  fields,
  card: false,
} as const;
