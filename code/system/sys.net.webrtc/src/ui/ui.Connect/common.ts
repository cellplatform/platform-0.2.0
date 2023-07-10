import { type t } from '../common';
import { DEFAULTS as INFO_DEFAULTS } from '../ui.Info';

export { WebRtc } from '../../WebRtc';
export * from '../common';

/**
 * Defaults
 */
const edge: t.VEdge = 'Top';
const DEFAULT_FIELDS: t.WebRtcInfoField[] = ['State.Shared', 'Group', 'Group.Peers'];

export const DEFAULTS = {
  edge,
  innerCard: false,
  showInfo: true,
  fields: {
    all: INFO_DEFAULTS.fields.all,
    default: DEFAULT_FIELDS,
  },
  copied: {
    message: '( copied to clipboard )',
    delay: 1500,
  },
} as const;
