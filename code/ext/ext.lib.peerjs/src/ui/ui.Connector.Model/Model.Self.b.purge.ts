import { DEFAULTS, Time, Value, rx, slug, type t } from './common';
import { Data } from './u.Data';
import { ResetTimer } from './u.Timer';

export function purgeBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateSelf;
  events: t.ConnectorItemStateSelfEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { dispatch, events, state } = args;
  const { peer } = args.ctx();
  const redraw = dispatch.redraw;

  const resetTimer = ResetTimer(DEFAULTS.timeout.closePending, () => Purge.reset());

  const Purge = {
    pending() {
      resetTimer.start();
      state.change((item) => (Data.self(item).purgePending = true));
      redraw();
    },
    reset() {
      resetTimer.clear();
      state.change((item) => (Data.self(item).purgePending = false));
      redraw();
    },
    run() {
      const res = peer.purge();
      Purge.reset();

      const tx = slug();
      const message = res.changed
        ? `(${res.total.after} ${Value.plural(res.total.after, 'item', 'items')} purged)`
        : '(no change)';
      state.change((item) => (Data.self(item).actionCompleted = { tx, message }));
      redraw();

      Time.delay(DEFAULTS.timeout.copiedPending, () => {
        if (Data.self(state).actionCompleted?.tx !== tx) return;
        state.change((item) => (Data.self(item).actionCompleted = undefined));
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
      rx.map((key) => ({ key, data: Data.self(state) })),
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
