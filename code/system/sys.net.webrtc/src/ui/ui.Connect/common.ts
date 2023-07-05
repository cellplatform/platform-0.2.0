import { type t } from '../common';

export { WebRtc } from '../../WebRtc';
export * from '../common';

/**
 * Defaults
 */
const edge: t.VEdge = 'Top';
const fields: t.WebRtcInfoField[] = ['State.Shared', 'Group', 'Group.Peers'];

export const DEFAULTS = {
  edge,
  fields,
  card: false,
  copied: { message: 'Copied to clipboard', delay: 1500 },
} as const;
