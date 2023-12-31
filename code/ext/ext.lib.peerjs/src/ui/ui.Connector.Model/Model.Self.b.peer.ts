import { rx, type t } from './common';

export function peerBehavior(args: {
  ctx: t.GetConnectorCtx;
  item: t.ConnectorItemStateSelf;
  events: t.ConnectorItemStateSelfEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { dispatch } = args;
  const { peer } = args.ctx();
  const peerEvents = peer.events();
  const redraw = dispatch.redraw;

  /**
   * Redraw on open stat change (peer "ready").
   */
  peerEvents.$.pipe(
    rx.map((e) => e.to.open),
    rx.distinctWhile((prev, next) => prev === next),
  ).subscribe(redraw);
}
