import { rx, type t } from './common';

type Cmd = { type: string; payload: { tx: string } };

/**
 * Tools for working with properties that act like
 * an command/event stream.
 */
export const Command = {
  /**
   * Dispatches by changing the "cmd" (command) property on the
   * managed state object, and auto-clears it after release.
   *
   * NOTE:
   *    This prevents stale commands from being re-run if there
   *    is a UI event (such as a re-render) that causes the current
   *    command value to re-considered.
   */
  dispatcher<T extends Cmd>(
    state?: t.PatchState<{ cmd?: T }, any>,
    options: { debounce?: t.Milliseconds } = {},
  ) {
    const { debounce = 0 } = options;
    const dispatched$ = rx.subject();
    const reset = () => state?.change((d) => (d.cmd = undefined));
    let _tx = '';

    dispatched$
      .pipe(
        rx.debounceTime(debounce),
        rx.filter(() => state?.current.cmd?.payload.tx === _tx),
      )
      .subscribe(reset);

    function dispatch(cmd: T) {
      _tx = cmd.payload.tx;
      state?.change((d) => (d.cmd = cmd));
      dispatched$.next();
    }

    return dispatch;
  },
} as const;
