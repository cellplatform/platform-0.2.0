import { DEFAULTS, Time, type t } from './common';
import { Data } from './u.Data';
import { State } from './u.State';

export function openConnectionBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, state, dispatch } = args;
  const redraw = () => dispatch.redraw();

  const connect = async () => {
    const { peer, list } = args.ctx();
    const data = Data.remote(state.current);
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
      console.log('error:', error, 'remote:', remoteid);
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
   * Listen: "Connect" button (triggers).
   */
  events.key.enter$.subscribe(connect);
  events.cmd.action.on('remote:right').subscribe(connect);
}
