import { Data } from './Data';
import { Model, PeerUri, Time, slug, type t } from './common';

export function clipboardBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, state, dispatch } = args;
  const redraw = dispatch.redraw;

  /**
   * Behavior: Paste
   */
  events.cmd.clipboard.paste$.subscribe(async (e) => {
    const ctx = args.ctx();
    const tx = slug();

    const pasted = (await navigator.clipboard.readText()).trim();
    const isValid = PeerUri.Is.peerid(pasted) || PeerUri.Is.uri(pasted);
    const peerid = isValid ? PeerUri.id(pasted) : '';

    const self = Data.self(Model.List.get(ctx.list).item(0)!);
    const isSelf = self.localid === peerid;

    state.change((d) => {
      const data = Data.remote(d);
      data.remoteid = peerid;

      if (!isValid) data.error = { type: 'InvalidPeer', tx };
      else if (isSelf) data.error = { type: 'PeerIsSelf', tx };
      else data.error = undefined;

      d.label = peerid;
      if (data.error) d.label = undefined;
    });

    redraw();

    Time.delay(3000, () => {
      if (Data.remote(state).error?.tx !== tx) return;
      state.change((d) => {
        const data = Data.remote(d);
        if (data.error) data.remoteid = undefined;
        data.error = undefined;
      });

      redraw();
    });
  });
}
