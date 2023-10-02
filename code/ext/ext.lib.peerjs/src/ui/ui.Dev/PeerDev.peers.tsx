import { Webrtc } from '../../Webrtc';
import { Button, Icons, cuid, type t } from '../common';

export function peersSection(args: {
  dev: t.DevTools;
  state: t.DevCtxState<t.PeerDevCtx>;
  local: t.PeerDevLocalStore;
  onPeer?: (peer: t.Peer) => void;
}) {
  const { dev, state, local } = args;
  dev.section('Peers', (dev) => {
    const placeholder = 'enter peer-id';

    const initPeer = (state: t.DevCtxState<t.PeerDevCtx>, peerid: string) => {
      const peer = Webrtc.Peer.create(peerid);
      state.change((d) => {
        local.localPeer = peerid;
        d.peerid.local = peerid;
        d.options = peer.options;
      });
      args.onPeer?.(peer);
    };

    dev.textbox((txt) => {
      const copy = () => navigator.clipboard.writeText(state.current.peerid.local);
      const regenerate = () => initPeer(state, cuid());
      txt
        .label((e) => 'local peer-id')
        .placeholder(placeholder)
        .value((e) => state.current.peerid.local)
        .left((e) => (
          <Button onClick={regenerate} margin={[0, 5, 0, 0]}>
            <Icons.Refresh size={16} tooltip={'New Peer ID'} />
          </Button>
        ))
        .right((e) => (
          <Button onClick={copy}>
            <Icons.Copy size={16} tooltip={'Copy'} />
          </Button>
        ))
        .onChange((e) => state.change((d) => (d.peerid.local = e.to.value)))
        .onEnter((e) => initPeer(state, state.current.peerid.local));
    });

    dev.hr(0, 10);

    dev.textbox((txt) => {
      const copy = () => navigator.clipboard.writeText(state.current.peerid.remote);
      txt
        .label((e) => 'remote peer-id')
        .placeholder(placeholder)
        .value((e) => state.current.peerid.remote)
        .right((e) => (
          <Button onClick={copy}>
            <Icons.Copy size={16} tooltip={'Copy'} />
          </Button>
        ))
        .onChange((e) => state.change((d) => (local.remotePeer = d.peerid.remote = e.to.value)));
    });

    /**
     * Initialize.
     */
    initPeer(state, local.localPeer || cuid());
  });
}
