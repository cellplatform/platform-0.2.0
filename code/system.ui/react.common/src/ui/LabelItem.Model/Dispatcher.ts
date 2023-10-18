import { rx, type t } from './common';

type Cmd = { type: string; payload: { tx: string } };

/**
 * Dispatches a command by changing the property on the
 * managed state object, and auto-clears it after release.
 *
 * NOTE:
 *    This prevents stale commands from being re-run if there
 *    is a UI event (such as a re-render) that causes the current
 *    command value to re-considered.
 */
export function Dispatcher<T extends Cmd>(
  state?: t.PatchState<{ cmd?: T }>,
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

  return {
    dispatch(cmd: T) {
      _tx = cmd.payload.tx;
      state?.change((d) => (d.cmd = cmd));
      dispatched$.next();
    },
  } as const;
}
