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
    const data = Data.remote(state.current);
    if (data.stage === 'Connecting' || data.stage === 'Connected') return;

    const { peer, list } = args.ctx();

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
        redraw();
      });

      Time.delay(DEFAULTS.errorTimeout, () => {
        if (Data.remote(state).error?.tx !== tx) return;
        state.change((d) => {
          Data.remote(d).error = undefined;
          d.label = data.remoteid;
          redraw();
        });
      });
    } else {
      state.change((d) => {
        const data = Data.remote(d);
        data.stage = 'Connected';
      });
    }

    // Add
    if (!error) {
      list.change((d) => {
        d.total += 1; // TEMP 🐷
      });
    }
  };

  /**
   * Listen: "Connect" button trigger.
   */
  events.key.enter$.subscribe(connect);
  events.cmd.action.on('remote:right').subscribe(connect);
}
