import { Data } from './u.Data';
import { DEFAULTS, PeerUri, Time, slug, type t } from './common';

export function clipboardBehavior(args: {
  ctx: t.GetConnectorCtx;
  item: t.ConnectorItemStateSelf;
  events: t.ConnectorItemStateSelfEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, item, dispatch } = args;
  const redraw = dispatch.redraw;

  /**
   * Behavior: Copy
   */
  const copyClipboard = async () => {
    const peerid = Data.self(item).peerid;
    await navigator.clipboard.writeText(PeerUri.uri(peerid));

    const tx = slug();
    item.change((item) => (Data.self(item).actionCompleted = { tx, message: 'copied' }));
    redraw();

    Time.delay(DEFAULTS.timeout.copiedPending, () => {
      if (Data.self(item).actionCompleted?.tx !== tx) return;
      item.change((item) => (Data.self(item).actionCompleted = undefined));
      redraw();
    });
  };

  /**
   * UI Events (Incoming)
   */
  events.cmd.clipboard.copy$.subscribe(copyClipboard);
  events.cmd.action.kind('self:right').subscribe(copyClipboard);
}
