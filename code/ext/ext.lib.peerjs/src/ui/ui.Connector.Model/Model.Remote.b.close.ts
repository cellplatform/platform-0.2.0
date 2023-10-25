import { Data } from './Data';
import { DEFAULTS, Time, rx, type t } from './common';

export function closeConnectionBehavior(args: {
  ctx: t.GetConnectorCtx;
  state: t.ConnectorItemStateRemote;
  events: t.ConnectorItemStateRemoteEvents;
  dispatch: t.LabelItemDispatch;
}) {
  const { events, state, dispatch } = args;
  const redraw = dispatch.redraw;
  const listEvents = args.ctx().list.events();
  const itemid = state.instance;

  const startDelete = () => {
    state.change((d) => (Data.remote(d).closePending = true));
    redraw();
    Time.delay(DEFAULTS.timeout.closePending, reset);
  };

  const completeDelete = () => {
    console.log('complete CLOSE');
    reset();
  };

  const reset = () => {
    state.change((d) => (Data.remote(d).closePending = false));
    redraw();
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
    .subscribe(startDelete);

  on('Enter')
    .pipe(rx.filter((data) => data.closePending!))
    .subscribe(completeDelete);

  on('Escape')
    .pipe(rx.filter((data) => data.closePending!))
    .subscribe(reset);

  const selected$ = listEvents.selected$.pipe(
    rx.distinctWhile((prev, next) => prev === itemid && next == itemid),
    rx.map((id) => ({ isSelected: id === itemid, data: Data.remote(state) })),
  );

  /**
   * Selection Events (triggers).
   */
  selected$
    .pipe(
      rx.filter((e) => !e.isSelected),
      rx.filter((e) => e.data.closePending!),
    )
    .subscribe(reset);
}
