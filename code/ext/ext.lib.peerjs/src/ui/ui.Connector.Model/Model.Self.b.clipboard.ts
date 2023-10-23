import { Data } from './Data';
import { Model, PeerUri, Time, slug, type t } from './common';

export function clipboardBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateSelf;
  events: t.ConnectorItemStateSelfEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, state, dispatch } = args;
  const redraw = () => dispatch.redraw();

  const copyClipboard = async () => {
    const peerid = Data.self(state).localid;
    await navigator.clipboard.writeText(PeerUri.uri(peerid));

    const tx = slug();
    state.change((d) => (Data.self(d).copied = tx));
    dispatch.redraw();

    Time.delay(1200, () => {
      if (Data.self(state).copied !== tx) return;
      state.change((d) => (Data.self(d).copied = undefined));
      dispatch.redraw();
    });
  };

  /**
   * UI Events (Incoming)
   */
  events.cmd.clipboard.copy$.subscribe(copyClipboard);
  events.cmd.action.on('self:right').subscribe(copyClipboard);
}
