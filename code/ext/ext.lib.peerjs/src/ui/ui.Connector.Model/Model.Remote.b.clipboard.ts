import { DEFAULTS, PeerUri, Time, rx, slug, type t } from './common';
import { Data } from './u.Data';
import { State } from './u.State';

export function clipboardBehavior(args: {
  ctx: t.GetConnectorCtx;
  item: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, item, dispatch } = args;
  const redraw = dispatch.redraw;
  const canPaste = () => Data.remote(item).stage !== 'Connected';

  /**
   * Behavior: Start editing.
   * NOTE: This puts a <input> in place to recieve the pasted data.
   *       This is a hack to avoid the security checks in some browsers
   *       on the JS [clipboard.readText] method.
   *       This does not open a security hole, but rather is just UX
   *       because the user is using the keyboard anyhow.
   */
  const startEditing = () => {
    State.Remote.resetError(item);
    dispatch.edit('start');
  };

  /**
   * Behavior: Paste
   */
  const pasteClipboard = async (text: string) => {
    if (!canPaste()) return;

    const { peer, list } = args.ctx();
    State.Remote.setPeerText(item, list, peer, text, {
      events,
      errorTimeout: true,
      errorCleared: (e) => peer.purge(),
    });
  };

  /**
   * Behavior: Copy
   */
  const copyToClipboard = async () => {
    const data = Data.remote(item);
    const peerid = data.remoteid;
    if (!peerid || data.closePending) return;
    await navigator.clipboard.writeText(PeerUri.uri(peerid));

    const tx = slug();
    item.change((item) => (Data.remote(item).actionCompleted = { tx, message: 'copied' }));
    redraw();

    Time.delay(DEFAULTS.timeout.copiedPending, () => {
      if (Data.remote(item).actionCompleted?.tx !== tx) return;
      item.change((item) => (Data.remote(item).actionCompleted = undefined));
      redraw();
    });
  };

  /**
   * (Listen)
   */
  events.cmd.clipboard.copy$.subscribe(copyToClipboard);

  events.key.$.pipe(
    rx.filter((e) => (e.is.os.mac ? e.is.meta : e.is.ctrl)),
    rx.filter(() => canPaste()),
  ).subscribe(() => startEditing()); // NB: prepare <input> to catch paste operation.

  events.cmd.edited$
    .pipe(
      rx.filter(() => canPaste()),
      rx.filter((e) => e.action === 'accepted'),
    )
    .subscribe((e) => pasteClipboard(e.label));
}
