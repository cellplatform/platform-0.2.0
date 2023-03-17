import { t } from './common';
import { WebRtcEvents } from './Events.mjs';

/**
 * Creat a new events API wrapper.
 */
export function events(
  bus: t.EventBus<any>,
  peer: t.PeerId | t.Peer,
  options: { dispose$?: t.Observable<any> } = {},
) {
  const { dispose$ } = options;
  const id = typeof peer === 'string' ? peer : peer.id;
  return WebRtcEvents({ instance: { bus, id }, dispose$ });
}
