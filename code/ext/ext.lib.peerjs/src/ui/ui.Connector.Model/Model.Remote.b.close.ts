import { DEFAULTS, Model, rx, type t } from './common';
import { Data } from './u.Data';
import { ResetTimer } from './u.Timer';

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

  const resetTimer = ResetTimer(DEFAULTS.timeout.closePending, () => Close.reset());

  const Close = {
    pending() {
      resetTimer.start();
      state.change((item) => (Data.remote(item).closePending = true));
      redraw();
    },
    reset() {
      resetTimer.clear();
      state.change((item) => (Data.remote(item).closePending = false));
      redraw();
    },
    complete() {
      const conn = Data.remote(state).connid ?? '';
      if (conn) peer.disconnect(conn);
      removeListItem();
    },
  };

  const removeListItem = () => {
    const index = list.current.getItem?.(itemid)[1] ?? -1;
    if (index > -1) {
      listDispatch.remove(index);
      listDispatch.select(index === 0 ? 0 : index - 1);
    }
  };

  /**
   * (Triggers): Keyboard Events
   */
  const on = (...code: string[]) =>
    events.key.$.pipe(
      rx.filter((e) => code.includes(e.code)),
      rx.map((key) => ({ key, data: Data.remote(state) })),
      rx.filter((e) => e.data.stage === 'Connected'),
    );
  on('Delete', 'Backspace')
    .pipe(rx.filter((e) => !e.data.closePending))
    .subscribe(Close.pending);
  on('Enter')
    .pipe(rx.filter((e) => e.data.closePending!))
    .subscribe(Close.complete);
  on('Escape')
    .pipe(rx.filter((e) => e.data.closePending!))
    .subscribe(Close.reset);

  /**
   * (Triggers): Selection Events
   */
  listEvents
    .item(itemid)
    .selected$.pipe(
      rx.map((isSelected) => ({ isSelected, data: Data.remote(state) })),
      rx.filter((e) => !e.isSelected),
      rx.filter((e) => e.data.closePending!),
    )
    .subscribe(Close.reset);

  /**
   * (Triggers): Connection Closed
   */
  peerEvents.cmd.conn$
    .pipe(
      rx.filter((e) => e.action === 'closed'),
      rx.filter((e) => e.connection?.id === Data.remote(state).connid),
    )
    .subscribe(removeListItem);
}
