import { DEFAULTS, PeerUri, Time, rx, slug, type t } from './common';
import { Data } from './u.Data';
import { State } from './u.State';

export function clipboardBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, state, dispatch } = args;
  const redraw = dispatch.redraw;
  const canPaste = () => Data.remote(state).stage !== 'Connected';

  /**
   * Behavior: Paste
   */
  const pasteClipboard = async (text: string) => {
    if (!canPaste()) return;

    const { peer, list } = args.ctx();
    const { tx } = State.Remote.setPeerText(state, list, peer, text);

    Time.delay(DEFAULTS.timeout.error, () => {
      if (State.Remote.resetError(state, tx)) {
        peer.purge();
        redraw();
      }
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
  events.cmd.clipboard.copy$.subscribe(copyClipboard);

  events.key.$.pipe(
    rx.filter((e) => e.is.meta),
    rx.filter(() => canPaste()),
  ).subscribe(() => dispatch.edit('start'));

  events.cmd.edited$
    .pipe(
      rx.filter(() => canPaste()),
      rx.filter((e) => e.action === 'accepted'),
    )
    .subscribe((e) => pasteClipboard(e.label));
}
