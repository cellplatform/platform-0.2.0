import { rx, type t } from './common';
import { Data } from './u.Data';
import { State } from './u.State';

export function openConnectionBehavior(args: {
  ctx: t.GetConnectorCtx;
  item: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, item, dispatch } = args;
  const redraw = dispatch.redraw;
  const getData = () => Data.remote(item);

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
      State.Remote.setAsConnecting(item, value);
      redraw();
    };

    connecting(true);
    const { conn, error } = await peer.connect.data(remoteid);
    connecting(false);

    if (error) {
      State.Remote.setError(item, 'ConnectFail', { message: error, timeout: true });
    }

    if (!error) {
      State.Remote.setAsConnected(item, list, conn);
    }
  };

  /**
   * Clear the remote-peer data.
   */
  const clear = () => {
    State.Remote.clearPeerText(item);
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
