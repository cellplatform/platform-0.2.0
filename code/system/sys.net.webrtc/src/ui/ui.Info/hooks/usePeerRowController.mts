import { R, type t, WebRtcState } from '../common';
import { useInfo } from './useInfo.mjs';
import { useNetworkState } from './useNetworkState.mjs';

type TFacet = t.WebRtcInfoPeerFacet;

type Args = {
  peerid: t.PeerId;
  client?: t.WebRtcEvents;
  enabled?: boolean;
  isSelf?: boolean;
};

/**
 * Controller for a single peer.
 */
export function usePeerRowController(args: Args) {
  const { peerid, client, isSelf = false } = args;
  const enabled = Boolean(client && (args.enabled ?? true));

  const info = useInfo(client);
  const doc = useNetworkState(info?.state);
  const peerState = doc?.network.peers[peerid];
  const totalPeers = Object.keys(doc?.network.peers ?? {}).length;

  /**
   * Configure buttons state.
   */
  const selfPeer = info?.peer;
  const selfCamera = info?.peer.connections.media
    .filter((conn) => conn.metadata.input === 'camera')
    .find((conn) => conn.peer.local === selfPeer?.id);

  let spinning: TFacet[] = [];
  let disabled: TFacet[] = [];
  let off: TFacet[] = ['Video', 'Mic', 'Screen'];
  const remove = (list: TFacet[], value: TFacet) => list.filter((item) => item !== value);
  const disable = (...value: TFacet[]) => disabled.push(...value);

  if (!isSelf || totalPeers < 2) disable('Video', 'Screen');
  if (selfCamera) off = remove(off, 'Video');
  if (peerState?.conns?.mic) off = remove(off, 'Mic');

  spinning = R.uniq(spinning);
  disabled = R.uniq(disabled);
  off = R.uniq(off);

  /**
   * Click Handler.
   */
  const onCtrlClick: t.WebRtcInfoPeerCtrlsClickHandler = async (e) => {
    const doc = await client?.info.state();
    if (!enabled || !client || !doc) return;

    const selfid = client.instance.id ?? '';
    const state = WebRtcState.init(doc);

    if (e.kind === 'Close' && !isSelf) {
      await client.close.fire(peerid);
    }

    if (e.kind === 'Video') {
      state.peer(selfid, selfid).change((self) => {
        const conns = self.conns || (self.conns = {});
        conns.video = true;
        conns.mic = true;
      });
    }

    if (e.kind === 'Screen') {
      state.peer(selfid, selfid).change((self) => {
        const conns = self.conns || (self.conns = {});
        conns.screen = true;
      });
    }

    if (e.kind === 'Mic') {
      state.peer(selfid, peerid).change((peer) => {
        const conns = peer.conns || (peer.conns = {});
        conns.mic = !Boolean(conns.mic);
      });
    }
  };

  /**
   * API
   */
  return {
    instance: client?.instance,
    enabled,
    spinning,
    disabled,
    off,
    state: { doc, peer: peerState },
    onCtrlClick,
  };
}
