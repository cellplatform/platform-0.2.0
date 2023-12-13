import { rx, DEFAULTS, Time, type t, slug } from './common';
import { Data } from './u.Data';
import { State } from './u.State';

export function openConnectionBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, state, dispatch } = args;
  const redraw = dispatch.redraw;
  const getData = () => Data.remote(state);

  /**
   * Connect to the remote peer.
   */
  const connect = async () => {
    const { peer, list } = args.ctx();
    const data = getData();
    if (data.stage === 'Connecting' || data.stage === 'Connected') return;
    if (data.closePending) return;

    const remoteid = (data.remoteid ?? '').trim();
    if (!remoteid) return;

    const connecting = (value: boolean) => {
      State.Remote.setAsConnecting(state, value);
      redraw();
    };

    connecting(true);
    const { conn, error } = await peer.connect.data(remoteid);
    connecting(false);

    if (error) {
      console.error('connect error:', error, 'remote:', remoteid);
      const { tx } = State.Remote.setConnectError(state, error);
      redraw();

      Time.delay(DEFAULTS.timeout.error, () => {
        if (State.Remote.resetError(state, tx, remoteid)) redraw();
      });
    }

    if (!error) {
      State.Remote.setAsConnected(state, list, conn);
    }
  };

  /**
   * Clear the remote-peer data.
   */
  const clear = () => {
    State.Remote.clearPeerText(state);
    redraw();
  };

  /**
   * Listen: "Connect" button (triggers).
   */
  events.cmd.action.kind('remote:right').subscribe(connect);
  events.key.enter$.subscribe(connect);
  events.key.escape$
    .pipe(
      rx.map((e) => getData()),
      rx.filter((data) => !data.stage && !!data.remoteid),
    )
    .subscribe(clear);
}
