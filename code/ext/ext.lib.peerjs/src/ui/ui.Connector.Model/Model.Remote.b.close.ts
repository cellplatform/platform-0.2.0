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
  const peerEvents = peer.events(events.dispose$);
  const listEvents = list.events(events.dispose$);
  const listDispatch = Model.List.commands(list);
  const itemid = state.instance;

  const ResetTimer = {
    _: undefined as t.TimeDelayPromise | undefined,
    clear: () => ResetTimer._?.cancel(),
    start() {
      ResetTimer.clear();
      ResetTimer._ = Time.delay(DEFAULTS.timeout.closePending, Close.reset);
    },
  };

  const removeFromList = () => {
    const index = list.current.getItem?.(itemid)[1] ?? -1;
    if (index > -1) {
      listDispatch.remove(index);
      listDispatch.select(index === 0 ? 0 : index - 1);
    }
  };

  const Close = {
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
      const conn = Data.remote(state).connid ?? '';
      if (conn) peer.disconnect(conn);
      removeFromList();
    },
  };

  /**
   * (Triggers): Keyboard Events
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
    .subscribe(Close.pending);
  on('Enter')
    .pipe(rx.filter((data) => data.closePending!))
    .subscribe(Close.complete);
  on('Escape')
    .pipe(rx.filter((data) => data.closePending!))
    .subscribe(Close.reset);

  /**
   * (Triggers): Selection Events
   */
  const unselected$ = listEvents.selected$.pipe(
    rx.distinctWhile((prev, next) => prev === itemid && next == itemid),
    rx.map((id) => ({ isSelected: id === itemid, data: Data.remote(state) })),
    rx.filter((e) => !e.isSelected),
    rx.filter((e) => e.data.closePending!),
  );
  unselected$.subscribe(Close.reset);

  /**
   * (Triggers): Connection Closed
   */
  const connectionClosed$ = peerEvents.cmd.conn$.pipe(
    rx.filter((e) => e.action === 'closed'),
    rx.filter((e) => e.connection?.id === Data.remote(state).connid),
  );
  connectionClosed$.subscribe(removeFromList);
}
