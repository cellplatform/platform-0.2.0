import { Data } from './Data';
import { DEFAULTS, Model, type t, slug, Time } from './common';

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
      state.change((d) => {
        const data = Data.remote(d);
        data.stage = value ? 'Connecting' : undefined;
        Model.action(d, 'remote:right')[0].enabled = !value;
        redraw();
      });
    };

    connecting(true);
    const { error } = await peer.connect.data(remoteid);
    connecting(false);

    if (error) {
      const tx = slug();
      state.change((d) => {
        const data = Data.remote(d);
        data.error = { tx, type: 'ConnectFail', message: error };
        d.label = undefined;
        Model.action(d, 'remote:right')[0].button = false;
        redraw();
      });

      Time.delay(DEFAULTS.timeout.error, () => {
        if (Data.remote(state).error?.tx !== tx) return;
        state.change((d) => {
          Data.remote(d).error = undefined;
          d.label = data.remoteid;
          Model.action(d, 'remote:right')[0].button = true;
          redraw();
        });
      });
    } else {
      state.change((d) => {
        const data = Data.remote(d);
        data.stage = 'Connected';
      });
    }

    if (!error) {
      // Add the next [+] item.
      list.change((d) => (d.total += 1));
    }
  };

  /**
   * Listen: "Connect" button (triggers).
   */
  events.key.enter$.subscribe(connect);
  events.cmd.action.on('remote:right').subscribe(connect);
}
