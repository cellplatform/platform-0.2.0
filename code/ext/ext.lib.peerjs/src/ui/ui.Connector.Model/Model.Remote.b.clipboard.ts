import { Data } from './Data';
import { DEFAULTS, Model, PeerUri, Time, slug, type t } from './common';

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
  const pasteClipboard = async () => {
    const stage = Data.remote(state).stage;
    if (stage === 'Connected') return;

    const ctx = args.ctx();
    const tx = slug();

    const pasted = (await navigator.clipboard.readText()).trim();
    const isValid = PeerUri.Is.peerid(pasted) || PeerUri.Is.uri(pasted);
    const peerid = isValid ? PeerUri.id(pasted) : '';

    const self = Data.self(Model.List.get(ctx.list).item(0)!);
    const isSelf = self.peerid === peerid;

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

    Time.delay(DEFAULTS.errorTimeout, () => {
      if (Data.remote(state).error?.tx !== tx) return;
      state.change((d) => {
        const data = Data.remote(d);
        if (data.error) data.remoteid = undefined;
        data.error = undefined;
        redraw();
      });
    });
  };

  /**
   * Behavior: Copy
   */
  const copyClipboard = async () => {
    const peerid = Data.remote(state).remoteid;
    if (!peerid) return;
    await navigator.clipboard.writeText(PeerUri.uri(peerid));

    const tx = slug();
    state.change((d) => (Data.remote(d).copied = tx));
    redraw();

    Time.delay(1200, () => {
      if (Data.remote(state).copied !== tx) return;
      state.change((d) => (Data.remote(d).copied = undefined));
      redraw();
    });
  };

  /**
   * UI Events (Incoming)
   */
  events.cmd.clipboard.paste$.subscribe(pasteClipboard);
  events.cmd.clipboard.copy$.subscribe(copyClipboard);
}
