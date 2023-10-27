import { Data } from './u.Data';
import { DEFAULTS, Model, Time, slug, type t } from './common';

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

    const remoteid = data.remoteid ?? '';
    if (!remoteid) {
      // TODO: surface problem to UI
      return;
    }

    const connecting = (value: boolean) => {
      state.change((item) => {
        const data = Data.remote(item);
        data.stage = value ? 'Connecting' : undefined;
        Model.action(item, 'remote:right')[0].enabled = !value;
        redraw();
      });
    };

    connecting(true);
    const { conn, error } = await peer.connect.data(remoteid);
    connecting(false);

    if (error) {
      const tx = slug();
      state.change((item) => {
        const data = Data.remote(item);
        data.error = { tx, type: 'ConnectFail', message: error };
        item.label = undefined;
        Model.action(item, 'remote:right')[0].button = false;
        redraw();
      });

      Time.delay(DEFAULTS.timeout.error, () => {
        if (Data.remote(state).error?.tx !== tx) return;
        state.change((item) => {
          Data.remote(item).error = undefined;
          item.label = data.remoteid;
          Model.action(item, 'remote:right')[0].button = true;
          redraw();
        });
      });
    }

    if (!error) {
      state.change((item) => {
        const data = Data.remote(item);
        data.stage = 'Connected';
        data.connid = conn.connectionId;
        Model.action(item, 'remote:right')[0].button = false;
      });

      // Add the next [+] item.
      list.change((item) => (item.total += 1));
    }
  };

  /**
   * Listen: "Connect" button (triggers).
   */
  events.key.enter$.subscribe(connect);
  events.cmd.action.on('remote:right').subscribe(connect);
}
