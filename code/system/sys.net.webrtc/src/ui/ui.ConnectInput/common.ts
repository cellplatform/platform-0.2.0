import type { t } from '../common';

export * from '../common';
export { WebRtcUtils } from '../../WebRtc.Util';

/**
 * Constants
 */
export const FIELDS: t.ConnectInputFields[] = ['Peer:Remote', 'Peer:Self', 'Video:Self'];

const fields: t.ConnectInputFields[] = ['Peer:Remote', 'Peer:Self'];
export const DEFAULTS = {
  fields,
  spinning: false,
} as const;
