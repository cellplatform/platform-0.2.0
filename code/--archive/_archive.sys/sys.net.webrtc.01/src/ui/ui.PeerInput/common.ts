import type { t } from '../common';

export * from '../common';
export { WebRtcUtils } from '../../WebRtc.Util';

/**
 * Constants
 */
export const FIELDS: t.PeerInputField[] = ['Peer:Remote', 'Peer:Self', 'Video'];

const config: t.PeerInputConfigButton = { visible: true, selected: false };

const fields: t.PeerInputField[] = ['Peer:Remote', 'Peer:Self'];
export const DEFAULTS = {
  fields,
  spinning: false,
  enabled: true,
  prefix: 'me',
  config,
} as const;
