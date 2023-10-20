import { Data } from './Data';
import { Model, PeerUri, Time, slug, type t } from './common';

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
     */
    console.log('connect', e);
  });
}
