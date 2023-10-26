import { Data } from './u.Data';
import { DEFAULTS, Model, PeerUri, Time, rx, slug, type t } from './common';

export function clipboardBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, state, dispatch } = args;
  const redraw = dispatch.redraw;

  /**
   * Remove the written data.
   */
  const clearPasted = () => {
    state.change((item) => {
      const data = Data.remote(item);
      data.remoteid = undefined;
      data.stage = undefined;
      item.label = undefined;
    });
    redraw();
  };

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
    const remoteid = isValid ? PeerUri.id(pasted) : '';

    const self = Data.self(Model.List.get(ctx.list).item(0)!);
    const isSelf = self.peerid === remoteid;
    const alreadyConnected =
      !isSelf && ctx.peer.current.connections.some((c) => c.peer.remote === remoteid);

    state.change((item) => {
      const data = Data.remote(item);
      data.remoteid = remoteid;

      if (!isValid) data.error = { type: 'InvalidPeer', tx };
      else if (isSelf) data.error = { type: 'PeerIsSelf', tx };
      else if (alreadyConnected) data.error = { type: 'PeerAlreadyConnected', tx };
      else data.error = undefined;

      item.label = remoteid;
      if (data.error) item.label = undefined;
    });

    redraw();

    Time.delay(DEFAULTS.timeout.error, () => {
      if (Data.remote(state).error?.tx !== tx) return;
      state.change((item) => {
        const data = Data.remote(item);
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
    const data = Data.remote(state);
    const peerid = data.remoteid;
    if (!peerid || data.closePending) return;
    await navigator.clipboard.writeText(PeerUri.uri(peerid));

    const tx = slug();
    state.change((item) => (Data.remote(item).actionCompleted = { tx, message: 'copied' }));
    redraw();

    Time.delay(DEFAULTS.timeout.copiedPending, () => {
      if (Data.remote(state).actionCompleted?.tx !== tx) return;
      state.change((item) => (Data.remote(item).actionCompleted = undefined));
      redraw();
    });
  };

  /**
   * (Triggers)
   */
  events.cmd.clipboard.paste$.subscribe(pasteClipboard);
  events.cmd.clipboard.copy$.subscribe(copyClipboard);
  events.key.escape$
    .pipe(
      rx.map((key) => ({ key, data: Data.remote(state) })),
      rx.filter((e) => Boolean(e.data.remoteid)),
      rx.filter((e) => e.data.stage === undefined),
    )
    .subscribe(clearPasted);
}
