import { type t } from '../common';
import { DEFAULTS as INFO_DEFAULTS } from '../ui.Info';

export { WebRtc } from '../../WebRtc';
export * from '../common';

/**
 * Defaults
 */
const edge: t.VEdge = 'Top';
const defaultFields: t.WebRtcInfoField[] = ['State.Shared', 'Group', 'Group.Peers', 'Namespace'];

export const DEFAULTS = {
  edge,
  showInfoAsCard: false,
  showInfo: true,
  fields: {
    all: INFO_DEFAULTS.fields.all,
    default: defaultFields,
  },
  copied: {
    message: '( copied to clipboard )',
    delay: 1500,
  },
} as const;
