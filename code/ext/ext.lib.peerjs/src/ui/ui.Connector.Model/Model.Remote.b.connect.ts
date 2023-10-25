import { Data } from './Data';
import { Webrtc, Model, PeerUri, Time, slug, type t, PatchState } from './common';

export function openConnectionBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, state, dispatch } = args;
  const redraw = () => dispatch.redraw();

  const connect = async () => {
    console.log('💥 connect');
    const data = Data.remote(state.current);
    console.log('data', data);
    console.log('state.current', state.current);
    if (data.connecting) return;

    const { peer, list } = args.ctx();

    const remoteid = data.remoteid ?? '';
    if (!remoteid) {
      // TODO: surface problem to UI
      return;
    }

    const spin = (isConnecting: boolean) => {
      state.change((d) => {
        Data.remote(d).connecting = isConnecting;
        Model.action(d, 'remote:right')[0].enabled = !isConnecting;
      });
      redraw();
    };

    spin(true);

    list.change((d) => {
      d.total += 1;
    });
    // Model.List.commands(list).redraw();

    const { conn } = await peer.connect.data(remoteid);
    console.log('conn', conn);

    spin(false);

    // state.change((d) => {
    //   Data.remote(d).connecting = true;
    //   Model.action(d, 'remote:right')[0].enabled = false;
    // });
  };

  /**
   * TODO 🐷
   * - listen for [ENTER] key (as ell as button click)
   * - start spinning
   * - connect to remote
   * - stop spinning, update visual state with connection.
   *
   */

  /**
   * Behavior: Connect Button Click
   */
  events.key.enter$.subscribe(connect);
  events.cmd.action.on('remote:right').subscribe(connect);
}
