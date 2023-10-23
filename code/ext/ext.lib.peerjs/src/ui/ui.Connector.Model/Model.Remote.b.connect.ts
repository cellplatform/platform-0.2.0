import { Data } from './Data';
import { Webrtc, Model, PeerUri, Time, slug, type t } from './common';

export function openConnectionBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, state, dispatch } = args;
  const redraw = () => dispatch.redraw();

  /**
   * Behavior: Connect Button Click
   */
  events.cmd.action.on('remote:right').subscribe((e) => {
    /**
     * TODO 🐷
     * - listen for [ENTER] key (as ell as button click)
     * - start spinning
     * - connect to remote
     * - stop spinning, update visual state with connection.
     *
     */
    console.log('💥 connect', e);

    console.log('WebRtc', Webrtc);
    const peer = Webrtc.Peer.create();

    // peer.connect()

    const data = Data.remote(state.current);
    console.log('data', data);

    const remoteid = data.remoteid ?? '';
    if (!remoteid) {
      // TODO: signal problem
    }

    const conn = peer.connect(remoteid);

    console.log('conn', conn);
    conn.on('open', async () => {
      console.log('on open:', conn);
      // console.log('open', conn);
      // conn.send(`hi from ${local}!`);
      // connections.push(conn);
      // dev.redraw();
      // await e.change((d) => (d.debug.connectingData = false));

      /**
       * TODO 🐷
       */
    });
  });
}
