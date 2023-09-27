import { type t, Button, cuid, Icons, DEFAULTS, Peer } from '../common';
import { WebRtc } from '../../WebRtc';

export type DevPeerCtx = {
  peerid: { local: string; remote: string };
  options?: t.PeerOptions;
};
export type DevPeerLocalStore = { localPeer: string; remotePeer: string };

export function peersSection(
  dev: t.DevTools,
  state: t.DevCtxState<DevPeerCtx>,
  local: DevPeerLocalStore,
  fn?: (peer: t.Peer) => void,
) {
  dev.section('Peers', (dev) => {
    const placeholder = 'enter peer-id';

    const initPeer = (state: t.DevCtxState<DevPeerCtx>, peerid: string) => {
      const options = WebRtc.Peer.options(DEFAULTS.signal);
      const peer = new Peer(peerid, options);

      state.change((d) => {
        local.localPeer = peerid;
        d.peerid.local = peerid;
        d.options = options;
      });

      fn?.(peer);
    };

    dev.textbox((txt) => {
      const copy = () => navigator.clipboard.writeText(state.current.peerid.local);
      const regenerate = () => initPeer(state, cuid());
      txt
        .label((e) => 'local id')
        .placeholder(placeholder)
        .value((e) => state.current.peerid.local)
        .right((e) => (
          <div>
            <Button onClick={regenerate} margin={[0, 5, 0, 0]}>
              <Icons.Refresh size={16} tooltip={'New Peer ID'} />
            </Button>
            <Button onClick={copy}>
              <Icons.Copy size={16} tooltip={'Copy'} />
            </Button>
          </div>
        ))
        .onChange((e) => state.change((d) => (d.peerid.local = e.to.value)))
        .onEnter((e) => initPeer(state, state.current.peerid.local));
    });

    dev.hr(0, 10);

    dev.textbox((txt) => {
      const copy = () => navigator.clipboard.writeText(state.current.peerid.remote);
      txt
        .label((e) => 'remote id')
        .placeholder(placeholder)
        .value((e) => state.current.peerid.remote)
        .right((e) => (
          <div>
            <Button onClick={copy}>
              <Icons.Copy size={16} tooltip={'Copy'} />
            </Button>
          </div>
        ))
        .onChange((e) => state.change((d) => (local.remotePeer = d.peerid.remote = e.to.value)));
    });

    /**
     * Initialize.
     */
    initPeer(state, local.localPeer || cuid());
  });
}
