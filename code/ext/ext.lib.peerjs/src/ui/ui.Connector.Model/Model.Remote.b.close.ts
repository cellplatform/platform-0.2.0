import { Data } from './Data';
import { DEFAULTS, Model, Time, rx, type t } from './common';

export function closeConnectionBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, state, dispatch } = args;
  const redraw = dispatch.redraw;

  const { list, peer } = args.ctx();
  const listEvents = list.events();
  const listDispatch = Model.List.commands(list);
  const itemid = state.instance;

  const ResetTimer = {
    _: undefined as t.TimeDelayPromise | undefined,
    clear: () => ResetTimer._?.cancel(),
    start() {
      ResetTimer.clear();
      ResetTimer._ = Time.delay(DEFAULTS.timeout.closePending, Delete.reset);
    },
  };

  const Delete = {
    pending() {
      ResetTimer.clear();
      state.change((d) => (Data.remote(d).closePending = true));
      ResetTimer.start();
      redraw();
    },
    reset() {
      ResetTimer.clear();
      state.change((d) => (Data.remote(d).closePending = false));
      redraw();
    },
    complete() {
      // Close the network connection.
      const connid = Data.remote(state).connid ?? '';
      if (connid) peer.disconnect(connid);

      // Remove from the UI list.
      const index = list.current.getItem?.(itemid)[1] ?? -1;
      listDispatch.remove(index).select(index - 1);
    },
  };

  /**
   * Keyboard Events (triggers).
   */
  const on = (...code: string[]) => {
    return events.key.$.pipe(
      rx.filter((e) => code.includes(e.code)),
      rx.map(() => Data.remote(state)),
      rx.filter((data) => data.stage === 'Connected'),
    );
  };

  on('Delete', 'Backspace')
    .pipe(rx.filter((data) => !data.closePending))
    .subscribe(Delete.pending);

  on('Enter')
    .pipe(rx.filter((data) => data.closePending!))
    .subscribe(Delete.complete);

  on('Escape')
    .pipe(rx.filter((data) => data.closePending!))
    .subscribe(Delete.reset);

  /**
   * Selection Events (triggers).
   */
  const unselected$ = listEvents.selected$.pipe(
    rx.distinctWhile((prev, next) => prev === itemid && next == itemid),
    rx.map((id) => ({ isSelected: id === itemid, data: Data.remote(state) })),
    rx.filter((e) => !e.isSelected),
    rx.filter((e) => e.data.closePending!),
  );
  unselected$.subscribe(Delete.reset);
}
