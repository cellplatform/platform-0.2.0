import { DEFAULTS as TEST_DEFAULTS, Wrangle } from '../../WebRtc.TestNetwork';

import { WebRtc } from '../../WebRtc';
import { cuid, type t } from './common';

/**
 * Generate a new network peer
 */
export function peer(
  options: {
    id?: t.PeerId;
    log?: boolean;
    getStream?: t.PeerGetMediaStream | boolean;
    dispose$?: t.Observable<any>;
  } = {},
) {
  const { dispose$, id = cuid(), log } = options;
  const signal = TEST_DEFAULTS.signal;
  const getStream = Wrangle.getStream(options);
  return WebRtc.peer(signal, { id, getStream, log, dispose$ });
}
