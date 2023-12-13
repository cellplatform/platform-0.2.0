import { DEFAULTS, Time, Value, rx, slug, type t } from './common';
import { Data } from './u.Data';

export function purgeBehavior(args: {
  ctx: t.GetConnectorCtx;
  item: t.ConnectorItemStateSelf;
  events: t.ConnectorItemStateSelfEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { dispatch, events, item } = args;
  const { peer } = args.ctx();
  const redraw = dispatch.redraw;

  const timer = Time.action(DEFAULTS.timeout.closePending, (e) => {
    if (e.action === 'complete') Purge.reset();
  });

  const Purge = {
    pending() {
      timer.start();
      item.change((item) => (Data.self(item).purgePending = true));
      redraw();
    },
    reset() {
      timer.reset();
      item.change((item) => (Data.self(item).purgePending = false));
      redraw();
    },
    run() {
      const res = peer.purge();
      Purge.reset();

      const tx = slug();
      const message = res.changed
        ? `(${res.total.after} ${Value.plural(res.total.after, 'item', 'items')} purged)`
        : '(no change)';
      item.change((item) => (Data.self(item).actionCompleted = { tx, message }));
      redraw();

      Time.delay(DEFAULTS.timeout.copiedPending, () => {
        if (Data.self(item).actionCompleted?.tx !== tx) return;
        item.change((item) => (Data.self(item).actionCompleted = undefined));
        redraw();
      });
    },
  } as const;

  /**
   * (Triggers): Keyboard Events
   */
  const on = (...code: string[]) =>
    events.key.$.pipe(
      rx.filter((e) => code.includes(e.code)),
      rx.map((key) => ({ key, data: Data.self(item) })),
    );
  on('Delete', 'Backspace')
    .pipe(rx.filter((e) => !e.data.purgePending))
    .subscribe(Purge.pending);
  on('Enter')
    .pipe(rx.filter((e) => e.data.purgePending!))
    .subscribe(Purge.run);
  on('Escape')
    .pipe(rx.filter((e) => e.data.purgePending!))
    .subscribe(Purge.reset);
}
