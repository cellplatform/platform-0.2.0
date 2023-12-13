import { DEFAULTS, Time, rx, type t } from './common';
import { Data } from './u.Data';
import { State } from './u.State';

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
  const listItemEvents = listEvents.item(state.instance);

  const timer = Time.action(DEFAULTS.timeout.closePending, (e) => {
    if (e.action === 'complete') Close.reset();
  });

  const Close = {
    pending() {
      timer.start();
      state.change((item) => (Data.remote(item).closePending = true));
      redraw();
    },
    reset() {
      timer.reset();
      state.change((item) => (Data.remote(item).closePending = false));
      redraw();
    },
    complete() {
      const conn = Data.remote(state).connid ?? '';
      if (conn) peer.disconnect(conn);
      removeFromList();
    },
  };

  const removeFromList = () => State.Remote.removeFromList(state, list);

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
   * (Trigger): Click close
   */
  events.cmd.action
    .kind('remote:right')
    .pipe(rx.filter((e) => Data.remote(state).closePending!))
    .subscribe(Close.complete);

  /**
   * (Trigger): Selection Changed Event
   */
  listItemEvents.selected$
    .pipe(
      rx.filter((selected) => !selected),
      rx.filter((e) => Data.remote(state).closePending!),
    )
    .subscribe(Close.reset);

  /**
   * (Trigger): Connection Closed
   */
  peerEvents.cmd.conn$
    .pipe(
      rx.filter((e) => e.action === 'closed'),
      rx.filter((e) => e.connection?.id === Data.remote(state).connid),
    )
    .subscribe(removeFromList);
}
